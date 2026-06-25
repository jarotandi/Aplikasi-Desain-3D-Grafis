from __future__ import annotations

from pathlib import Path

import bpy


def configure_render(render_settings: dict) -> None:
    scene = bpy.context.scene
    scene.render.engine = render_settings.get("engine", "CYCLES") if render_settings.get("engine") in {"CYCLES", "BLENDER_EEVEE_NEXT"} else "CYCLES"
    scene.render.resolution_x = int(render_settings.get("width", 1600))
    scene.render.resolution_y = int(render_settings.get("height", 1200))
    scene.render.film_transparent = bool(render_settings.get("transparent", False))

    if scene.render.engine == "CYCLES":
        scene.cycles.samples = int(render_settings.get("samples", 64))
        scene.cycles.use_denoising = True


def render_png(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(output_path)
    bpy.ops.render.render(write_still=True)
