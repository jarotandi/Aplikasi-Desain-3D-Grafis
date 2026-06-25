import type { AISceneSuggestion } from "@/types/studio3d";

export async function generateSceneFromPrompt(prompt: string): Promise<AISceneSuggestion> {
  const lower = prompt.toLowerCase();
  if (lower.includes("booth")) {
    return {
      sceneName: "Booth Event 3x3",
      unit: "m",
      objects: [
        { type: "floor", name: "Floor 3x3", dimensions: { width: 3, depth: 3, height: 0.05 }, position: { x: 0, y: 0.025, z: 0 }, material: "wood" },
        { type: "backdrop", name: "Main Backdrop", dimensions: { width: 3, height: 2.5, depth: 0.1 }, position: { x: 0, y: 1.25, z: -1.45 }, material: "plywood" },
        { type: "table", name: "Display Table", dimensions: { width: 1.4, height: 0.75, depth: 0.65 }, position: { x: 0, y: 0.375, z: -0.35 }, material: "wood" },
        { type: "banner-stand", name: "Side Banner", dimensions: { width: 0.8, height: 2, depth: 0.05 }, position: { x: 1.25, y: 1, z: 0.3 }, material: "fabric" }
      ]
    };
  }

  return {
    sceneName: "Product Display Layout",
    unit: "m",
    objects: [
      { type: "floor", name: "Base Floor", dimensions: { width: 2, depth: 2, height: 0.05 }, position: { x: 0, y: 0.025, z: 0 }, material: "wood" },
      { type: "product-display", name: "Main Product Display", dimensions: { width: 1, height: 1.2, depth: 0.45 }, position: { x: 0, y: 0.6, z: 0 }, material: "plywood" }
    ]
  };
}

export async function suggestMaterials() {
  return ["Plywood", "HPL", "Fabric", "Acrylic"];
}

export async function generateProductionBrief(project: unknown) {
  return { project, brief: "Production brief placeholder generated from current scene." };
}

export async function generatePricingSuggestion(project: unknown) {
  return { project, suggestion: "Pricing recommendation placeholder. Use order formula for MVP." };
}

export async function generateMockupIdea(productType: string, designBrief: string) {
  return { productType, designBrief, idea: "Use strong front composition, smaller sleeve detail, and contrast-safe color palette." };
}
