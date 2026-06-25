import type { Product } from "@/types";

export type MockupModelKind = "tshirt" | "mug" | "tote" | "box" | "keychain" | "trophy";

export type MockupModelConfig = {
  kind: MockupModelKind;
  label: string;
  glbUrl?: string;
  designArea: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
};

const fallbackConfig: MockupModelConfig = {
  kind: "tshirt",
  label: "T-shirt Placeholder",
  designArea: {
    position: [0, 0.18, 0.08],
    rotation: [0, 0, 0],
    scale: [1.25, 1, 1]
  }
};

export function getMockupModelConfig(product?: Product): MockupModelConfig {
  const name = product?.name.toLowerCase() ?? "";
  if (name.includes("mug") || name.includes("tumbler")) {
    return {
      kind: "mug",
      label: "Mug/Tumbler Placeholder",
      designArea: { position: [0, 0.2, 1.04], rotation: [0, 0, 0], scale: [1.1, 0.72, 1] }
    };
  }
  if (name.includes("tote")) {
    return {
      kind: "tote",
      label: "Tote Bag Placeholder",
      designArea: { position: [0, 0.1, 0.12], rotation: [0, 0, 0], scale: [1.25, 1.05, 1] }
    };
  }
  if (name.includes("packaging") || name.includes("paper bag") || name.includes("sleeve")) {
    return {
      kind: "box",
      label: "Packaging Box Placeholder",
      designArea: { position: [0, 0.1, 1.02], rotation: [0, 0, 0], scale: [1.2, 0.86, 1] }
    };
  }
  if (name.includes("keychain")) {
    return {
      kind: "keychain",
      label: "Keychain Placeholder",
      designArea: { position: [0, 0, 0.14], rotation: [0, 0, 0], scale: [1.05, 0.72, 1] }
    };
  }
  if (name.includes("trophy") || name.includes("logo stand")) {
    return {
      kind: "trophy",
      label: "Trophy/Stand Placeholder",
      designArea: { position: [0, 0.15, 0.22], rotation: [0, 0, 0], scale: [0.95, 0.52, 1] }
    };
  }
  return fallbackConfig;
}
