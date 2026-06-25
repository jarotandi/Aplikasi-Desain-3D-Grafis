import * as THREE from "three";
import type { StudioMaterial } from "@/types/material";

export function createThreeMaterial(material: StudioMaterial) {
  return new THREE.MeshStandardMaterial({
    color: material.color,
    roughness: material.roughness,
    metalness: material.metalness,
    opacity: material.opacity,
    transparent: material.opacity < 1
  });
}
