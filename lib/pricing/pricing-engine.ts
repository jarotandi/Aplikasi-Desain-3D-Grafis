import type { PricingInput, PricingOutput } from "@/lib/pricing/types";
import { getPrintFee, getQuantityDiscount, getSetupFee } from "@/lib/pricing/rules";

export function calculatePrice(input: PricingInput): PricingOutput {
  const notes: string[] = [];
  const lineBase = input.basePrice * input.quantity;
  const setupFee = getSetupFee(input);
  const printFee = getPrintFee(input);
  const finishingFee = input.finishing ?? 0;
  const packagingFee = input.packaging ?? 0;
  const rushFee = input.deadlineDays < input.normalProductionDays ? (lineBase + printFee) * 0.2 : 0;
  if (rushFee > 0) notes.push("Rush order +20% karena deadline lebih cepat dari waktu produksi normal.");

  let threeDExtra = 0;
  if (input.materialGram || input.printTimeHour) {
    const materialCost = (input.materialGram ?? 0) * 850;
    const machineCost = (input.printTimeHour ?? 0) * 12000;
    const risk = 1 + (input.failureRiskPercentage ?? 8) / 100;
    threeDExtra = (materialCost + machineCost) * risk;
    notes.push("Harga 3D printing menghitung material, waktu print, dan failure risk.");
  }

  const beforeDiscount = lineBase + setupFee + printFee + finishingFee + packagingFee + rushFee + threeDExtra;
  const discount = beforeDiscount * getQuantityDiscount(input.quantity);
  if (discount > 0) notes.push(`Diskon quantity ${Math.round(getQuantityDiscount(input.quantity) * 100)}%.`);
  const margin = input.vendorCost ? (beforeDiscount - discount - input.vendorCost) * (input.margin ?? 0.25) : beforeDiscount * (input.margin ?? 0.18);
  const subtotal = beforeDiscount - discount;
  const total = subtotal + margin;

  return {
    basePrice: lineBase,
    setupFee,
    printFee,
    finishingFee,
    rushFee,
    discount,
    margin,
    subtotal,
    total,
    notes
  };
}

export function calculateDummyQuotation() {
  return calculatePrice({
    productId: "prod-tshirt-24s",
    quantity: 200,
    basePrice: 65000,
    printMethod: "DTF",
    printAreaCount: 1,
    designComplexity: "full_color",
    deadlineDays: 7,
    normalProductionDays: 10,
    finishing: 250000,
    packaging: 200000,
    margin: 0.16
  });
}
