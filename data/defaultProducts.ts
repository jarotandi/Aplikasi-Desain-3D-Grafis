import type { StudioProductModel } from "@/types/product";

const apparelAreas = [
  { id: "front", name: "Front", meshName: "front", width: 0.9, height: 1.1, position: { x: 0, y: 1.1, z: -0.16 }, rotation: { x: 0, y: 0, z: 0 } },
  { id: "back", name: "Back", meshName: "back", width: 0.9, height: 1.1, position: { x: 0, y: 1.1, z: 0.16 }, rotation: { x: 0, y: Math.PI, z: 0 } },
  { id: "left-sleeve", name: "Left Sleeve", meshName: "left_sleeve", width: 0.35, height: 0.45, position: { x: -0.85, y: 1.1, z: -0.08 }, rotation: { x: 0, y: 0.4, z: 0 } },
  { id: "right-sleeve", name: "Right Sleeve", meshName: "right_sleeve", width: 0.35, height: 0.45, position: { x: 0.85, y: 1.1, z: -0.08 }, rotation: { x: 0, y: -0.4, z: 0 } },
  { id: "label", name: "Label", meshName: "label", width: 0.25, height: 0.16, position: { x: 0, y: 1.75, z: -0.17 }, rotation: { x: 0, y: 0, z: 0 } }
];

const cylinderAreas = [
  { id: "front", name: "Front", meshName: "front", width: 0.65, height: 0.75, position: { x: 0, y: 1, z: -0.68 }, rotation: { x: 0, y: 0, z: 0 } },
  { id: "back", name: "Back", meshName: "back", width: 0.65, height: 0.75, position: { x: 0, y: 1, z: 0.68 }, rotation: { x: 0, y: Math.PI, z: 0 } },
  { id: "label", name: "Label", meshName: "label", width: 0.28, height: 0.18, position: { x: 0, y: 1.55, z: -0.56 }, rotation: { x: 0, y: 0, z: 0 } }
];

export const defaultProducts: StudioProductModel[] = [
  { id: "prod-tshirt", name: "T-shirt", productType: "t-shirt", modelUrl: "/models/products/t-shirt.glb", thumbnailUrl: "/products/t-shirt.png", printableAreas: apparelAreas, basePrice: 65000, materialOptions: ["Cotton", "Polyester"], sizeOptions: ["S", "M", "L", "XL"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-oversize", name: "Oversize T-shirt", productType: "oversize-t-shirt", modelUrl: "/models/products/oversize-t-shirt.glb", thumbnailUrl: "/products/oversize.png", printableAreas: apparelAreas, basePrice: 85000, materialOptions: ["Cotton"], sizeOptions: ["M", "L", "XL"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-hoodie", name: "Hoodie", productType: "hoodie", modelUrl: "/models/products/hoodie.glb", thumbnailUrl: "/products/hoodie.png", printableAreas: apparelAreas, basePrice: 165000, materialOptions: ["Fleece"], sizeOptions: ["S", "M", "L", "XL"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-jersey", name: "Jersey", productType: "jersey", modelUrl: "/models/products/jersey.glb", thumbnailUrl: "/products/jersey.png", printableAreas: apparelAreas, basePrice: 95000, materialOptions: ["Dryfit", "Polyester"], sizeOptions: ["S", "M", "L", "XL", "XXL"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-cap", name: "Cap", productType: "cap", modelUrl: "/models/products/cap.glb", thumbnailUrl: "/products/cap.png", printableAreas: apparelAreas, basePrice: 55000, materialOptions: ["Canvas", "Polyester"], sizeOptions: ["Adjustable"], metadata: { placeholderGeometry: "sphere" } },
  { id: "prod-tote", name: "Tote Bag", productType: "tote-bag", modelUrl: "/models/products/tote-bag.glb", thumbnailUrl: "/products/tote.png", printableAreas: apparelAreas, basePrice: 42000, materialOptions: ["Canvas"], sizeOptions: ["M", "L"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-mug", name: "Mug", productType: "mug", modelUrl: "/models/products/mug.glb", thumbnailUrl: "/products/mug.png", printableAreas: cylinderAreas, basePrice: 35000, materialOptions: ["Ceramic"], sizeOptions: ["11oz", "15oz"], metadata: { placeholderGeometry: "cylinder" } },
  { id: "prod-tumbler", name: "Tumbler", productType: "tumbler", modelUrl: "/models/products/tumbler.glb", thumbnailUrl: "/products/tumbler.png", printableAreas: cylinderAreas, basePrice: 78000, materialOptions: ["Stainless Steel"], sizeOptions: ["500ml", "750ml"], metadata: { placeholderGeometry: "cylinder" } },
  { id: "prod-bottle", name: "Bottle", productType: "bottle", modelUrl: "/models/products/bottle.glb", thumbnailUrl: "/products/bottle.png", printableAreas: cylinderAreas, basePrice: 68000, materialOptions: ["Plastic", "Stainless Steel"], sizeOptions: ["500ml"], metadata: { placeholderGeometry: "cylinder" } },
  { id: "prod-phonecase", name: "Phone Case", productType: "phone-case", modelUrl: "/models/products/phone-case.glb", thumbnailUrl: "/products/phonecase.png", printableAreas: apparelAreas, basePrice: 45000, materialOptions: ["Plastic"], sizeOptions: ["iPhone", "Android"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-sticker", name: "Sticker", productType: "sticker", modelUrl: "/models/products/sticker.glb", thumbnailUrl: "/products/sticker.png", printableAreas: apparelAreas, basePrice: 8000, materialOptions: ["Paper", "Plastic"], sizeOptions: ["A6", "A5", "A4"], metadata: { placeholderGeometry: "plane" } },
  { id: "prod-packaging", name: "Packaging Box", productType: "packaging-box", modelUrl: "/models/products/packaging-box.glb", thumbnailUrl: "/products/packaging.png", printableAreas: apparelAreas, basePrice: 18000, materialOptions: ["Cardboard"], sizeOptions: ["S", "M", "L"], metadata: { placeholderGeometry: "box" } },
  { id: "prod-banner", name: "Banner", productType: "banner", modelUrl: "/models/products/banner.glb", thumbnailUrl: "/products/banner.png", printableAreas: apparelAreas, basePrice: 120000, materialOptions: ["Fabric"], sizeOptions: ["1x2m", "2x3m"], metadata: { placeholderGeometry: "plane" } },
  { id: "prod-booth", name: "Booth Backdrop", productType: "booth-backdrop", modelUrl: "/models/products/booth-backdrop.glb", thumbnailUrl: "/products/booth.png", printableAreas: apparelAreas, basePrice: 1500000, materialOptions: ["Plywood", "ACP", "Fabric"], sizeOptions: ["3x3m", "3x6m"], metadata: { placeholderGeometry: "box" } }
];
