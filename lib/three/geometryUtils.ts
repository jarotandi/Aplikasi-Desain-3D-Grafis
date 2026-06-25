import * as THREE from "three";
import type { Dimensions, GeometryType } from "@/types/studio3d";

export function createGeometry(type: GeometryType, dimensions: Dimensions) {
  switch (type) {
    case "sphere":
      return new THREE.SphereGeometry(Math.max(dimensions.width, dimensions.depth) / 2, 48, 32);
    case "cylinder":
      return new THREE.CylinderGeometry(dimensions.width / 2, dimensions.width / 2, dimensions.height, 48);
    case "cone":
      return new THREE.ConeGeometry(dimensions.width / 2, dimensions.height, 48);
    case "torus":
      return new THREE.TorusGeometry(dimensions.width / 2, Math.max(0.02, dimensions.depth / 8), 24, 96);
    case "plane":
    case "decal":
      return new THREE.PlaneGeometry(dimensions.width, dimensions.height);
    case "imported":
      return new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
    default:
      return new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth);
  }
}

export function createExtrudedShapeFrom2DPoints(points: Array<[number, number]>, depth: number) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
}

export function createBoxFromRectangle(width: number, depth: number, height: number) {
  return new THREE.BoxGeometry(width, height, depth);
}
