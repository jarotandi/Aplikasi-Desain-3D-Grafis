import type { Vector3Value } from "@/types/studio3d";

export interface PrintableArea3D {
  id: string;
  name: string;
  meshName: string;
  width: number;
  height: number;
  position: Vector3Value;
  rotation: Vector3Value;
  uvBounds?: [number, number, number, number];
}

export interface ProductMockup {
  id: string;
  productType: string;
  baseModelUrl?: string;
  designTextureUrl?: string;
  printableAreas: PrintableArea3D[];
  selectedArea?: string;
  placement: {
    position: Vector3Value;
    rotation: Vector3Value;
    scale: Vector3Value;
  };
  materialId: string;
  color: string;
  size: string;
  quantity: number;
}

export interface StudioProductModel {
  id: string;
  name: string;
  productType: string;
  modelUrl?: string;
  thumbnailUrl?: string;
  printableAreas: PrintableArea3D[];
  basePrice: number;
  materialOptions: string[];
  sizeOptions: string[];
  metadata: Record<string, unknown>;
}
