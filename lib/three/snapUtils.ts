import type { SceneObject, SnapMode, Vector3Value } from "@/types/studio3d";

export function snapValue(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize;
}

export function snapVectorToGrid(vector: Vector3Value, gridSize: number): Vector3Value {
  return {
    x: snapValue(vector.x, gridSize),
    y: snapValue(vector.y, gridSize),
    z: snapValue(vector.z, gridSize)
  };
}

function distance(a: Vector3Value, b: Vector3Value) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function objectSnapPoints(object: SceneObject, mode: SnapMode): Vector3Value[] {
  const { position, dimensions } = object;
  if (mode === "vertex") {
    return [-1, 1].flatMap((x) =>
      [-1, 1].flatMap((y) =>
        [-1, 1].map((z) => ({
          x: position.x + (dimensions.width / 2) * x,
          y: position.y + (dimensions.height / 2) * y,
          z: position.z + (dimensions.depth / 2) * z
        }))
      )
    );
  }
  if (mode === "edge" || mode === "midpoint") {
    return [
      { x: position.x - dimensions.width / 2, y: position.y, z: position.z },
      { x: position.x + dimensions.width / 2, y: position.y, z: position.z },
      { x: position.x, y: position.y, z: position.z - dimensions.depth / 2 },
      { x: position.x, y: position.y, z: position.z + dimensions.depth / 2 },
      position
    ];
  }
  if (mode === "face") {
    return [
      { x: position.x, y: position.y + dimensions.height / 2, z: position.z },
      { x: position.x, y: position.y - dimensions.height / 2, z: position.z },
      { x: position.x, y: position.y, z: position.z + dimensions.depth / 2 },
      { x: position.x, y: position.y, z: position.z - dimensions.depth / 2 }
    ];
  }
  return [position];
}

export function snapVector(vector: Vector3Value, options: { gridSize: number; mode: SnapMode; objects: SceneObject[]; excludeIds?: string[]; threshold?: number }) {
  if (options.mode === "grid") return snapVectorToGrid(vector, options.gridSize);
  const threshold = options.threshold ?? options.gridSize * 0.65;
  const points = options.objects
    .filter((object) => !options.excludeIds?.includes(object.id))
    .flatMap((object) => objectSnapPoints(object, options.mode));
  const nearest = points.reduce<{ point?: Vector3Value; distance: number }>(
    (current, point) => {
      const nextDistance = distance(vector, point);
      return nextDistance < current.distance ? { point, distance: nextDistance } : current;
    },
    { distance: Number.POSITIVE_INFINITY }
  );
  return nearest.point && nearest.distance <= threshold ? nearest.point : vector;
}
