from __future__ import annotations

import base64
import tempfile
from pathlib import Path

import bpy

from scripts.apply_material import apply_material


def data_url_to_temp_image(data_url: str, name: str) -> Path | None:
    if not data_url.startswith("data:image/"):
        return None
    _, encoded = data_url.split(",", 1)
    suffix = ".png" if "png" in data_url[:32] else ".jpg"
    path = Path(tempfile.gettempdir()) / f"studio-decal-{name}{suffix}"
    path.write_bytes(base64.b64decode(encoded))
    return path


def apply_decals(objects: list[dict]) -> None:
    for studio_object in objects:
        if studio_object.get("type") != "decal":
            continue

        decal_name = studio_object.get("name") or studio_object.get("id") or "decal"
        obj = bpy.data.objects.get(decal_name)
        if not obj:
            continue

        image_url = studio_object.get("decalImageUrl") or studio_object.get("material", {}).get("textureDataUrl")
        if not image_url:
            apply_material(obj, studio_object.get("material", {}))
            continue

        image_path = data_url_to_temp_image(image_url, str(decal_name))
        if not image_path:
            apply_material(obj, studio_object.get("material", {}))
            continue

        material = bpy.data.materials.new(name=f"{decal_name} Decal Material")
        material.use_nodes = True
        material.blend_method = "BLEND"

        nodes = material.node_tree.nodes
        principled = nodes.get("Principled BSDF")
        image_node = nodes.new("ShaderNodeTexImage")
        image_node.image = bpy.data.images.load(str(image_path))

        if principled:
            material.node_tree.links.new(image_node.outputs["Color"], principled.inputs["Base Color"])
            material.node_tree.links.new(image_node.outputs["Alpha"], principled.inputs["Alpha"])
            principled.inputs["Alpha"].default_value = float(studio_object.get("material", {}).get("opacity", 1.0))

        obj.data.materials.clear()
        obj.data.materials.append(material)
