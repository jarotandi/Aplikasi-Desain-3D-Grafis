import type { StudioMaterial } from "@/types/material";

export const defaultMaterials: StudioMaterial[] = [
  { id: "mat-cotton", name: "Cotton", category: "Clothing", color: "#f8fafc", roughness: 0.82, metalness: 0, opacity: 1, pricePerUnit: 42000 },
  { id: "mat-polyester", name: "Polyester", category: "Clothing", color: "#e2e8f0", roughness: 0.55, metalness: 0, opacity: 1, pricePerUnit: 38000 },
  { id: "mat-dryfit", name: "Dryfit", category: "Clothing", color: "#16a34a", roughness: 0.5, metalness: 0, opacity: 1, pricePerUnit: 52000 },
  { id: "mat-fleece", name: "Fleece", category: "Clothing", color: "#111827", roughness: 0.78, metalness: 0, opacity: 1, pricePerUnit: 78000 },
  { id: "mat-denim", name: "Denim", category: "Clothing", color: "#1d4ed8", roughness: 0.74, metalness: 0, opacity: 1, pricePerUnit: 64000 },
  { id: "mat-canvas", name: "Canvas", category: "Clothing", color: "#d6c7a8", roughness: 0.88, metalness: 0, opacity: 1, pricePerUnit: 36000 },
  { id: "mat-leather", name: "Leather", category: "Clothing", color: "#3f2a1d", roughness: 0.38, metalness: 0, opacity: 1, pricePerUnit: 98000 },
  { id: "mat-ceramic", name: "Ceramic", category: "Merchandise", color: "#ffffff", roughness: 0.28, metalness: 0, opacity: 1, pricePerUnit: 25000 },
  { id: "mat-stainless", name: "Stainless Steel", category: "Merchandise", color: "#94a3b8", roughness: 0.22, metalness: 0.75, opacity: 1, pricePerUnit: 58000 },
  { id: "mat-plastic", name: "Plastic", category: "Merchandise", color: "#f97316", roughness: 0.45, metalness: 0, opacity: 1, pricePerUnit: 18000 },
  { id: "mat-acrylic", name: "Acrylic", category: "Merchandise", color: "#67e8f9", roughness: 0.12, metalness: 0, opacity: 0.55, pricePerUnit: 47000 },
  { id: "mat-rubber", name: "Rubber", category: "Merchandise", color: "#18181b", roughness: 0.9, metalness: 0, opacity: 1, pricePerUnit: 20000 },
  { id: "mat-cardboard", name: "Cardboard", category: "Merchandise", color: "#b89565", roughness: 0.85, metalness: 0, opacity: 1, pricePerUnit: 12000 },
  { id: "mat-wood", name: "Wood", category: "Architecture/Event", color: "#9a6b3f", roughness: 0.7, metalness: 0, opacity: 1, pricePerUnit: 145000 },
  { id: "mat-metal", name: "Metal", category: "Architecture/Event", color: "#71717a", roughness: 0.28, metalness: 0.85, opacity: 1, pricePerUnit: 180000 },
  { id: "mat-glass", name: "Glass", category: "Architecture/Event", color: "#bae6fd", roughness: 0.04, metalness: 0, opacity: 0.35, pricePerUnit: 125000 },
  { id: "mat-concrete", name: "Concrete", category: "Architecture/Event", color: "#78716c", roughness: 0.92, metalness: 0, opacity: 1, pricePerUnit: 90000 },
  { id: "mat-fabric", name: "Fabric", category: "Architecture/Event", color: "#7c3aed", roughness: 0.86, metalness: 0, opacity: 1, pricePerUnit: 55000 },
  { id: "mat-plywood", name: "Plywood", category: "Architecture/Event", color: "#c08457", roughness: 0.72, metalness: 0, opacity: 1, pricePerUnit: 110000 }
];
