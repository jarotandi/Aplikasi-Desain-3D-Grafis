import type { Vector3Value } from "@/types/studio3d";

export function distanceBetween(a: Vector3Value, b: Vector3Value) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
