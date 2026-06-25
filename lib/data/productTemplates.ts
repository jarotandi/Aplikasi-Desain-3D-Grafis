import type { PrintableArea, ProductTemplate } from "@/lib/types/studio";

const apparelAreas: PrintableArea[] = [
  { id: "front", name: "Front", transform: { position: [0, 1.15, -0.18], rotation: [0, 0, 0], scale: [0.85, 0.85, 0.85] }, size: [1.2, 1.2] },
  { id: "back", name: "Back", transform: { position: [0, 1.15, 0.18], rotation: [0, Math.PI, 0], scale: [0.85, 0.85, 0.85] }, size: [1.2, 1.2] },
  { id: "left-sleeve", name: "Left Sleeve", transform: { position: [-1.05, 1.05, -0.1], rotation: [0, 0.35, 0], scale: [0.45, 0.45, 0.45] }, size: [0.55, 0.55] },
  { id: "right-sleeve", name: "Right Sleeve", transform: { position: [1.05, 1.05, -0.1], rotation: [0, -0.35, 0], scale: [0.45, 0.45, 0.45] }, size: [0.55, 0.55] },
  { id: "label", name: "Label", transform: { position: [0, 1.78, -0.19], rotation: [0, 0, 0], scale: [0.28, 0.28, 0.28] }, size: [0.35, 0.2] }
];

const cylinderAreas: PrintableArea[] = [
  { id: "front", name: "Front", transform: { position: [0, 1.05, -0.72], rotation: [0, 0, 0], scale: [0.65, 0.65, 0.65] }, size: [0.85, 0.85] },
  { id: "back", name: "Back", transform: { position: [0, 1.05, 0.72], rotation: [0, Math.PI, 0], scale: [0.65, 0.65, 0.65] }, size: [0.85, 0.85] },
  { id: "left-sleeve", name: "Left Side", transform: { position: [-0.72, 1.05, 0], rotation: [0, -Math.PI / 2, 0], scale: [0.52, 0.52, 0.52] }, size: [0.65, 0.65] },
  { id: "right-sleeve", name: "Right Side", transform: { position: [0.72, 1.05, 0], rotation: [0, Math.PI / 2, 0], scale: [0.52, 0.52, 0.52] }, size: [0.65, 0.65] },
  { id: "label", name: "Label", transform: { position: [0, 1.78, -0.55], rotation: [0, 0, 0], scale: [0.28, 0.28, 0.28] }, size: [0.35, 0.2] }
];

export const productTemplates: ProductTemplate[] = [
  {
    id: "t-shirt",
    name: "T-shirt",
    category: "Apparel",
    defaultColor: "#f8fafc",
    printableAreas: apparelAreas,
    modelUrl: "/models/products/t-shirt.glb",
    thumbnailUrl: "/products/t-shirt.png",
    sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
    materialOptions: ["Cotton Combed", "Polyester", "Oversize Cotton"],
    placeholder: { objectType: "mockup", transform: { position: [0, 0.9, 0], rotation: [0, 0, 0], scale: [2, 0.12, 2.35] } }
  },
  {
    id: "hoodie",
    name: "Hoodie",
    category: "Apparel",
    defaultColor: "#334155",
    printableAreas: apparelAreas,
    modelUrl: "/models/products/hoodie.glb",
    thumbnailUrl: "/products/hoodie.png",
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    materialOptions: ["Fleece", "Baby Terry", "Heavy Cotton"],
    placeholder: { objectType: "mockup", transform: { position: [0, 0.95, 0], rotation: [0, 0, 0], scale: [2.2, 0.2, 2.35] } }
  },
  {
    id: "mug",
    name: "Mug",
    category: "Drinkware",
    defaultColor: "#ffffff",
    printableAreas: cylinderAreas,
    modelUrl: "/models/products/mug.glb",
    thumbnailUrl: "/products/mug.png",
    sizeOptions: ["11oz", "15oz"],
    materialOptions: ["Ceramic", "Doff Ceramic"],
    placeholder: { objectType: "cylinder", transform: { position: [0, 0.78, 0], rotation: [0, 0, 0], scale: [1, 1.2, 1] } }
  },
  {
    id: "tumbler",
    name: "Tumbler",
    category: "Drinkware",
    defaultColor: "#94a3b8",
    printableAreas: cylinderAreas,
    modelUrl: "/models/products/tumbler.glb",
    thumbnailUrl: "/products/tumbler.png",
    sizeOptions: ["350ml", "500ml", "750ml"],
    materialOptions: ["Stainless", "Matte Coating"],
    placeholder: { objectType: "cylinder", transform: { position: [0, 1, 0], rotation: [0, 0, 0], scale: [0.8, 1.8, 0.8] } }
  },
  {
    id: "tote-bag",
    name: "Tote Bag",
    category: "Bag",
    defaultColor: "#e7dcc8",
    printableAreas: apparelAreas,
    modelUrl: "/models/products/tote-bag.glb",
    thumbnailUrl: "/products/tote-bag.png",
    sizeOptions: ["Small", "Medium", "Large"],
    materialOptions: ["Canvas", "Blacu", "Drill"],
    placeholder: { objectType: "mockup", transform: { position: [0, 0.9, 0], rotation: [0, 0, 0], scale: [1.7, 0.18, 2] } }
  },
  {
    id: "cap",
    name: "Cap",
    category: "Headwear",
    defaultColor: "#0f172a",
    printableAreas: apparelAreas,
    modelUrl: "/models/products/cap.glb",
    thumbnailUrl: "/products/cap.png",
    sizeOptions: ["Adjustable", "S/M", "L/XL"],
    materialOptions: ["Twill", "Canvas", "Polyester"],
    placeholder: { objectType: "sphere", transform: { position: [0, 1, 0], rotation: [0, 0, 0], scale: [1.35, 0.55, 1.05] } }
  },
  {
    id: "jersey",
    name: "Jersey",
    category: "Apparel",
    defaultColor: "#16a34a",
    printableAreas: apparelAreas,
    modelUrl: "/models/products/jersey.glb",
    thumbnailUrl: "/products/jersey.png",
    sizeOptions: ["S", "M", "L", "XL", "XXL", "3XL"],
    materialOptions: ["Dryfit", "Milano", "Hyget"],
    placeholder: { objectType: "mockup", transform: { position: [0, 0.9, 0], rotation: [0, 0, 0], scale: [2.05, 0.1, 2.3] } }
  }
];

export function getProductTemplate(id: string) {
  return productTemplates.find((template) => template.id === id);
}
