import type { ReactNode } from "react";

export type StudioUnit = "mm" | "cm" | "m" | "inch";
export type CameraView = "perspective" | "top" | "front" | "side";
export type TransformMode3D = "translate" | "rotate" | "scale";
export type SnapMode = "grid" | "vertex" | "edge" | "midpoint" | "face";
export type GeometryType =
  | "cube"
  | "box"
  | "plane"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "text3d"
  | "imported"
  | "wall"
  | "floor"
  | "door"
  | "window"
  | "table"
  | "chair"
  | "rack"
  | "booth"
  | "backdrop"
  | "stage"
  | "banner-stand"
  | "product-display"
  | "packaging-box"
  | "decal";

export type StudioToolId =
  | "select"
  | "move"
  | "rotate"
  | "scale"
  | "line"
  | "rectangle"
  | "circle"
  | "pushPull"
  | "extrude"
  | "offset"
  | "measure"
  | "paint"
  | "text3d"
  | "productPlacement"
  | "camera"
  | "render";

export interface Vector3Value {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface SceneObject {
  id: string;
  name: string;
  type: "mesh" | "group" | "mockup" | "decal";
  geometryType: GeometryType;
  position: Vector3Value;
  rotation: Vector3Value;
  scale: Vector3Value;
  dimensions: Dimensions;
  materialId: string;
  layerId: string;
  isLocked: boolean;
  isVisible: boolean;
  parentId?: string;
  childIds?: string[];
  metadata: Record<string, unknown>;
  productionData: {
    printableArea?: string;
    printMethod?: string;
    estimatedUsage?: number;
    notes?: string;
  };
}

export interface StudioLayer {
  id: string;
  name: string;
  isVisible: boolean;
  isLocked: boolean;
}

export interface StudioProject {
  id: string;
  userId?: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  unit: StudioUnit;
  sceneJson: Record<string, unknown>;
  objects: SceneObject[];
  materials: StudioMaterial[];
  productMockups: ProductMockup[];
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioTool {
  id: StudioToolId;
  name: string;
  icon: ReactNode;
  shortcut?: string;
  onPointerDown?: () => void;
  onPointerMove?: () => void;
  onPointerUp?: () => void;
  onCancel?: () => void;
}

export interface MeasurementState {
  width: number;
  depth: number;
  height: number;
  lastDistance?: number;
  rawInput?: string;
}

export interface StudioHistorySnapshot {
  sceneObjects: SceneObject[];
  selectedObjectIds: string[];
  materials: StudioMaterial[];
  layers: StudioLayer[];
}

export interface AIObjectSuggestion {
  type: GeometryType;
  name: string;
  dimensions: Dimensions;
  position: Vector3Value;
  material: string;
}

export interface AISceneSuggestion {
  sceneName: string;
  unit: StudioUnit;
  objects: AIObjectSuggestion[];
}

import type { StudioMaterial } from "@/types/material";
import type { OrderQuotation } from "@/types/order";
import type { ProductMockup } from "@/types/product";

export interface Studio3DState {
  currentProject: StudioProject;
  sceneObjects: SceneObject[];
  selectedObjectIds: string[];
  activeTool: StudioToolId;
  transformMode: TransformMode3D;
  unit: StudioUnit;
  gridSize: number;
  snapEnabled: boolean;
  snapMode: SnapMode;
  cameraView: CameraView;
  materials: StudioMaterial[];
  layers: StudioLayer[];
  productMockups: ProductMockup[];
  currentQuotation?: OrderQuotation;
  history: StudioHistorySnapshot[];
  future: StudioHistorySnapshot[];
  isSaving: boolean;
  isDirty: boolean;
  measurement: MeasurementState;
}
