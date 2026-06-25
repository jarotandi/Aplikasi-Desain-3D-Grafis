export interface StudioMaterial {
  id: string;
  name: string;
  category: "Clothing" | "Merchandise" | "Architecture/Event" | "Custom";
  color: string;
  textureUrl?: string;
  roughness: number;
  metalness: number;
  opacity: number;
  normalMapUrl?: string;
  pricePerUnit: number;
  supplierId?: string;
}
