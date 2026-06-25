from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.append(str(SCRIPT_DIR))

from scripts.apply_decal import apply_decals
from scripts.apply_material import apply_material
from scripts.render_output import configure_render, render_png
from scripts.setup_camera import setup_camera
from scripts.setup_lighting import setup_lighting


def args_after_double_dash() -> list[str]:
    if "--" not in sys.argv:
        return []
    return sys.argv[sys.argv.index("--") + 1 :]


def clear_scene() -> None:
    for obj in list(bpy.context.scene.objects):
        if obj.type not in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(obj, do_unlink=True)


def vector(values: list[float] | tuple[float, float, float] | None, fallback: tuple[float, float, float]) -> tuple[float, float, float]:
    if not values or len(values) != 3:
        return fallback
    return (float(values[0]), float(values[1]), float(values[2]))


def create_primitive(studio_object: dict) -> bpy.types.Object:
    object_type = studio_object.get("type", "cube")
    transform = studio_object.get("transform", {})
    location = vector(transform.get("position"), (0.0, 0.5, 0.0))
    rotation = vector(transform.get("rotation"), (0.0, 0.0, 0.0))
    scale = vector(transform.get("scale"), (1.0, 1.0, 1.0))

    if object_type == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, location=location, rotation=rotation)
    elif object_type == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.65, depth=1.4, location=location, rotation=rotation)
    elif object_type == "plane":
        bpy.ops.mesh.primitive_cube_add(size=1, location=location, rotation=rotation)
        scale = (scale[0] * 2.0, scale[1] * 0.04, scale[2] * 2.0)
    elif object_type == "cone":
        bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.75, depth=1.45, location=location, rotation=rotation)
    elif object_type == "torus":
        bpy.ops.mesh.primitive_torus_add(major_radius=0.65, minor_radius=0.22, major_segments=96, minor_segments=24, location=location, rotation=rotation)
    elif object_type == "decal":
        bpy.ops.mesh.primitive_plane_add(size=1.5, location=location, rotation=rotation)
    else:
        bpy.ops.mesh.primitive_cube_add(size=1, location=location, rotation=rotation)

    obj = bpy.context.object
    obj.name = studio_object.get("name") or studio_object.get("id") or object_type
    obj.scale = scale
    apply_material(obj, studio_object.get("material", {}))
    return obj


def create_text_label(studio_object: dict) -> None:
    label = studio_object.get("productMockupType") or ("3D Text" if studio_object.get("type") == "text" else None)
    if not label:
        return

    transform = studio_object.get("transform", {})
    location = vector(transform.get("position"), (0.0, 1.1, 0.0))
    bpy.ops.object.text_add(location=(location[0], location[1] + 0.58, location[2]), rotation=(1.2, 0, 0))
    text = bpy.context.object
    text.name = f"{studio_object.get('name', 'Object')} Label"
    text.data.body = str(label)
    text.data.align_x = "CENTER"
    text.data.align_y = "CENTER"
    text.data.size = 0.18
    apply_material(text, {"color": "#e5e7eb", "roughness": 0.8, "metalness": 0.0, "opacity": 1.0})


def build_scene(scene_payload: dict) -> None:
    scene_data = scene_payload.get("sceneData", {})
    objects = scene_data.get("objects", scene_data) if isinstance(scene_data, dict) else scene_data
    if not isinstance(objects, list):
        objects = []

    clear_scene()

    for studio_object in objects:
        if not studio_object.get("visible", True):
            continue
        create_primitive(studio_object)
        create_text_label(studio_object)

    apply_decals(objects)
    setup_lighting(scene_payload.get("renderSettings", {}))
    setup_camera(scene_payload.get("cameraData", {}), objects)


def main() -> None:
    args = args_after_double_dash()
    if len(args) != 2:
        raise SystemExit("Usage: blender -b product_scene.blend -P render_scene.py -- scene.json output.png")

    scene_path = Path(args[0])
    output_path = Path(args[1])
    scene_payload = json.loads(scene_path.read_text(encoding="utf-8"))

    build_scene(scene_payload)
    configure_render(scene_payload.get("renderSettings", {}))
    render_png(output_path)


if __name__ == "__main__":
    main()
