import type { SceneObject, Vector3Value } from "@/types/studio3d";

export function updateObjectPosition(object: SceneObject, position: Vector3Value): SceneObject {
  return { ...object, position };
}

export function cloneWithOffset(object: SceneObject, id: string, offset = 0.5): SceneObject {
  return {
    ...structuredClone(object),
    id,
    name: `${object.name} Copy`,
    position: { x: object.position.x + offset, y: object.position.y, z: object.position.z + offset },
    parentId: undefined,
    childIds: []
  };
}
