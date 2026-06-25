import type { PricingInput } from "@/lib/pricing/types";

export function getQuantityDiscount(quantity: number) {
  if (quantity >= 100) return 0.15;
  if (quantity >= 50) return 0.1;
  return 0;
}

export function getSetupFee(input: PricingInput) {
  if (input.printMethod.toLowerCase().includes("screen")) return 150000;
  if (input.printMethod.toLowerCase().includes("embroidery")) return 100000;
  return input.quantity < 24 ? 50000 : 0;
}

export function getPrintFee(input: PricingInput) {
  const areaMultiplier = Math.max(input.printAreaCount, 1);
  const complexityMultiplier = input.designComplexity === "full_color" ? 0.28 : input.designComplexity === "complex" ? 0.22 : 0.15;
  return input.basePrice * complexityMultiplier * areaMultiplier * input.quantity;
}
