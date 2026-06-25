import type { MaterialSettings, ObjectType, StudioObject, Transform } from "@/lib/types/studio";
import { createId } from "@/lib/utils/id";

const defaultTransform: Transform = {
  position: [0, 0.5, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1]
};

const defaultMaterial: MaterialSettings = {
  color: "#7dd3fc",
  roughness: 0.55,
  metalness: 0.1,
  opacity: 1
};

const labels: Record<ObjectType, string> = {
  cube: "Cube",
  sphere: "Sphere",
  cylinder: "Cylinder",
  plane: "Plane",
  cone: "Cone",
  torus: "Torus",
  text: "Text",
  decal: "Decal",
  model: "Imported Model",
  mockup: "Product Mockup",
  group: "Group"
};

export function createStudioObject(type: ObjectType, overrides: Partial<StudioObject> = {}): StudioObject {
  const now = new Date().toISOString();
  const id = overrides.id ?? createId(type);

  return {
    id,
    name: overrides.name ?? `${labels[type]} ${id.slice(-4)}`,
    type,
    transform: overrides.transform ?? {
      ...defaultTransform,
      position: type === "plane" || type === "decal" ? [0, 0.02, 0] : defaultTransform.position
    },
    material: overrides.material ?? defaultMaterial,
    visible: overrides.visible ?? true,
    locked: overrides.locked ?? false,
    modelDataUrl: overrides.modelDataUrl,
    decalImageUrl: overrides.decalImageUrl,
    productMockupType: overrides.productMockupType,
    productTemplateId: overrides.productTemplateId,
    printableAreaId: overrides.printableAreaId,
    parentId: overrides.parentId,
    childIds: overrides.childIds ?? [],
    modifiers: overrides.modifiers ?? [],
    createdAt: overrides.createdAt ?? now,
    updatedAt: now
  };
}
