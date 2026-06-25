from __future__ import annotations

import math

import bpy
from mathutils import Vector


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def setup_camera(camera_data: dict, objects: list[dict]) -> bpy.types.Object:
    camera = bpy.data.objects.get("Camera")
    if not camera:
        bpy.ops.object.camera_add()
        camera = bpy.context.object

    position = camera_data.get("position", [4.8, 3.8, 5.4])
    target = camera_data.get("target", [0.0, 0.8, 0.0])
    camera.location = (float(position[0]), float(position[1]), float(position[2]))
    look_at(camera, Vector((float(target[0]), float(target[1]), float(target[2]))))
    camera.data.lens = float(camera_data.get("lens", 45))
    camera.data.angle = math.radians(float(camera_data.get("fov", 45)))
    bpy.context.scene.camera = camera
    return camera
