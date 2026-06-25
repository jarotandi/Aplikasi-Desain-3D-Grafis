import type { Vector3Tuple } from "@/lib/types/studio";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function toFixedVector(values: Vector3Tuple): Vector3Tuple {
  return values.map((value) => Number(value.toFixed(3))) as Vector3Tuple;
}

export function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}
