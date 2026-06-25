from __future__ import annotations

from pathlib import Path

import bpy


BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = BASE_DIR / "templates" / "product_scene.blend"


def main() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()

    bpy.ops.object.camera_add(location=(4.8, 3.8, 5.4), rotation=(1.1, 0.0, 0.72))
    camera = bpy.context.object
    camera.name = "Camera"
    camera.data.lens = 45
    bpy.context.scene.camera = camera

    bpy.ops.object.light_add(type="AREA", location=(0, 5, 4))
    light = bpy.context.object
    light.name = "Template Area Light"
    light.data.energy = 600
    light.data.size = 5

    bpy.context.scene.render.resolution_x = 1600
    bpy.context.scene.render.resolution_y = 1200
    bpy.ops.wm.save_as_mainfile(filepath=str(TEMPLATE_PATH))


if __name__ == "__main__":
    main()
