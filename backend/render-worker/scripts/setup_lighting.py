from __future__ import annotations

import bpy


def setup_lighting(render_settings: dict) -> None:
    for obj in list(bpy.context.scene.objects):
        if obj.type == "LIGHT":
            bpy.data.objects.remove(obj, do_unlink=True)

    ambient = float(render_settings.get("ambientIntensity", 0.75))
    directional = float(render_settings.get("directionalIntensity", 1.35))

    bpy.context.scene.world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world.color = (0.03 * ambient, 0.04 * ambient, 0.06 * ambient)

    bpy.ops.object.light_add(type="AREA", location=(0, 5, 4))
    key = bpy.context.object
    key.name = "Studio Key Light"
    key.data.energy = 520 * directional
    key.data.size = 4.5

    bpy.ops.object.light_add(type="POINT", location=(-3, 2.5, -3))
    fill = bpy.context.object
    fill.name = "Studio Fill Light"
    fill.data.energy = 90 * ambient
