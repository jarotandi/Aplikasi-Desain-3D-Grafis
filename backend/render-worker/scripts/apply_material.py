from __future__ import annotations

import re

import bpy


def hex_to_rgba(value: str, opacity: float = 1.0) -> tuple[float, float, float, float]:
    if not isinstance(value, str) or not re.match(r"^#[0-9a-fA-F]{6}$", value):
        value = "#7dd3fc"
    red = int(value[1:3], 16) / 255
    green = int(value[3:5], 16) / 255
    blue = int(value[5:7], 16) / 255
    return (red, green, blue, max(0.0, min(1.0, float(opacity))))


def apply_material(obj: bpy.types.Object, settings: dict) -> bpy.types.Material:
    material = bpy.data.materials.new(name=f"{obj.name} Material")
    material.use_nodes = True
    material.blend_method = "BLEND"

    principled = material.node_tree.nodes.get("Principled BSDF")
    if principled:
        opacity = float(settings.get("opacity", 1.0))
        principled.inputs["Base Color"].default_value = hex_to_rgba(settings.get("color", "#7dd3fc"), opacity)
        principled.inputs["Roughness"].default_value = float(settings.get("roughness", 0.55))
        principled.inputs["Metallic"].default_value = float(settings.get("metalness", 0.1))
        principled.inputs["Alpha"].default_value = opacity

    obj.data.materials.clear()
    obj.data.materials.append(material)
    return material
