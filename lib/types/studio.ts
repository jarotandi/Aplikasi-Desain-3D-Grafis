export type ObjectType =
  | "cube"
  | "sphere"
  | "cylinder"
  | "plane"
  | "cone"
  | "torus"
  | "text"
  | "decal"
  | "model"
  | "mockup"
  | "group";

export type ToolType =
  | "select"
  | "move"
  | "rotate"
  | "scale"
  | "add-object"
  | "add-text"
  | "add-image"
  | "material"
  | "camera"
  | "lighting"
  | "mockup"
  | "ai";

export type TransformMode = "translate" | "rotate" | "scale";

export type ProductMockupType = "t-shirt" | "hoodie" | "mug" | "tumbler" | "tote-bag" | "cap" | "jersey";

export type PrintableAreaId = "front" | "back" | "left-sleeve" | "right-sleeve" | "label";

export type ModifierType = "boolean" | "bevel" | "mirror" | "subdivision";

export type Vector3Tuple = [number, number, number];

export interface Transform {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
}

export interface MaterialSettings {
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  textureDataUrl?: string;
}

export interface StudioModifier {
  id: string;
  type: ModifierType;
  name: string;
  enabled: boolean;
  applied: boolean;
  settings: Record<string, string | number | boolean>;
}

export interface StudioObject {
  id: string;
  name: string;
  type: ObjectType;
  transform: Transform;
  material: MaterialSettings;
  visible: boolean;
  locked: boolean;
  modelDataUrl?: string;
  decalImageUrl?: string;
  productMockupType?: ProductMockupType;
  productTemplateId?: string;
  printableAreaId?: PrintableAreaId;
  parentId?: string;
  childIds?: string[];
  modifiers: StudioModifier[];
  createdAt: string;
  updatedAt: string;
}

export interface SceneState {
  projectId: string;
  projectName: string;
  objects: StudioObject[];
  selectedObjectId?: string;
  selectedObjectIds: string[];
  viewportSettings: ViewportSettings;
}

export interface ViewportSettings {
  grid: boolean;
  ambientIntensity: number;
  directionalIntensity: number;
  background: string;
}

export interface RenderJob {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  message: string;
  createdAt: string;
  previewUrl?: string;
}

export interface SavedProject extends SceneState {
  savedAt: string;
}

export interface PrintableArea {
  id: PrintableAreaId;
  name: string;
  transform: Transform;
  size: [number, number];
}

export interface ProductTemplate {
  id: ProductMockupType;
  name: string;
  category: string;
  defaultColor: string;
  printableAreas: PrintableArea[];
  modelUrl?: string;
  thumbnailUrl?: string;
  sizeOptions: string[];
  materialOptions: string[];
  placeholder: {
    objectType: ObjectType;
    transform: Transform;
  };
}

export interface DesignAssistantSuggestion {
  suggestedProduct: string;
  colorPalette: Array<{ name: string; hex: string; usage: string }>;
  layoutSuggestion: string;
  materialSuggestion: string;
  logoPositionSuggestion: string;
  estimatedProductionNotes: string;
  promptForImageGeneration: string;
}
