export type PricingInput = {
  productId: string;
  variantId?: string;
  quantity: number;
  basePrice: number;
  printMethod: string;
  printAreaCount: number;
  designComplexity: "simple" | "standard" | "complex" | "full_color";
  deadlineDays: number;
  normalProductionDays: number;
  finishing?: number;
  packaging?: number;
  vendorCost?: number;
  margin?: number;
  materialGram?: number;
  printTimeHour?: number;
  failureRiskPercentage?: number;
};

export type PricingOutput = {
  basePrice: number;
  setupFee: number;
  printFee: number;
  finishingFee: number;
  rushFee: number;
  discount: number;
  margin: number;
  subtotal: number;
  total: number;
  notes: string[];
};
