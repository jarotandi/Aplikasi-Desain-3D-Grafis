import { calculatePrice } from "@/lib/pricing/pricing-engine";
import type { ThreeDMaterial, ThreeDPrintingConfig, ThreeDPrintingEstimate, ThreeDProductType } from "@/lib/three-d-printing/types";

export const threeDProducts: Record<ThreeDProductType, { label: string; defaultSize: [number, number, number]; basePrice: number; complexity: number }> = {
  keychain: { label: "Keychain", defaultSize: [70, 45, 4], basePrice: 18000, complexity: 0.82 },
  logo_stand: { label: "Logo Stand", defaultSize: [120, 55, 35], basePrice: 125000, complexity: 1.25 },
  name_plate: { label: "Name Plate", defaultSize: [160, 55, 8], basePrice: 85000, complexity: 1 },
  trophy: { label: "Trophy", defaultSize: [110, 180, 55], basePrice: 175000, complexity: 1.55 },
  plaque: { label: "Plaque", defaultSize: [140, 95, 8], basePrice: 95000, complexity: 1.05 },
  phone_stand: { label: "Phone Stand", defaultSize: [90, 140, 70], basePrice: 110000, complexity: 1.25 },
  desk_organizer: { label: "Desk Organizer", defaultSize: [180, 95, 75], basePrice: 150000, complexity: 1.45 }
};

export const materialProfiles: Record<ThreeDMaterial, { densityFactor: number; gramCost: number; speedFactor: number; failureRisk: number }> = {
  PLA: { densityFactor: 1, gramCost: 850, speedFactor: 1, failureRisk: 8 },
  PETG: { densityFactor: 1.08, gramCost: 1050, speedFactor: 1.18, failureRisk: 10 },
  ABS: { densityFactor: 1.03, gramCost: 980, speedFactor: 1.25, failureRisk: 13 },
  Resin: { densityFactor: 1.22, gramCost: 1500, speedFactor: 1.35, failureRisk: 12 }
};

export function defaultThreeDConfig(): ThreeDPrintingConfig {
  const product = threeDProducts.keychain;
  return {
    productType: "keychain",
    text: "MERCH",
    material: "PLA",
    color: "#6c63ff",
    widthMm: product.defaultSize[0],
    heightMm: product.defaultSize[1],
    depthMm: product.defaultSize[2],
    thicknessMm: 3,
    holeDiameterMm: 4,
    quantity: 10
  };
}

export function applyProductDefaults(config: ThreeDPrintingConfig, productType: ThreeDProductType): ThreeDPrintingConfig {
  const product = threeDProducts[productType];
  return {
    ...config,
    productType,
    widthMm: product.defaultSize[0],
    heightMm: product.defaultSize[1],
    depthMm: product.defaultSize[2],
    thicknessMm: productType === "keychain" || productType === "plaque" || productType === "name_plate" ? 3 : Math.max(config.thicknessMm, 4),
    holeDiameterMm: productType === "keychain" ? 4 : 0,
    quantity: productType === "keychain" ? Math.max(config.quantity, 10) : Math.max(config.quantity, 1)
  };
}

export function estimateThreeDPrinting(config: ThreeDPrintingConfig): ThreeDPrintingEstimate {
  const product = threeDProducts[config.productType];
  const material = materialProfiles[config.material];
  const volumeCm3 = (config.widthMm * config.heightMm * Math.max(config.thicknessMm, config.depthMm * 0.35)) / 1000;
  const infillFactor = config.productType === "desk_organizer" || config.productType === "phone_stand" ? 0.32 : config.productType === "trophy" ? 0.38 : 0.24;
  const materialGram = Math.max(4, Math.round(volumeCm3 * infillFactor * material.densityFactor * product.complexity));
  const printTimeHour = Number(Math.max(0.8, (materialGram / 18) * material.speedFactor + product.complexity * 0.45).toFixed(1));
  const finishingFee = config.productType === "trophy" || config.productType === "logo_stand" ? config.quantity * 25000 : config.quantity * 6000;
  const pricing = calculatePrice({
    productId: `3d-${config.productType}`,
    quantity: config.quantity,
    basePrice: product.basePrice,
    printMethod: config.material === "Resin" ? "Resin Print" : "FDM",
    printAreaCount: 1,
    designComplexity: "complex",
    deadlineDays: 5,
    normalProductionDays: config.productType === "keychain" ? 4 : 7,
    finishing: finishingFee,
    packaging: config.quantity * 1500,
    margin: 0.24,
    materialGram: materialGram * config.quantity,
    printTimeHour: printTimeHour * config.quantity,
    failureRiskPercentage: material.failureRisk
  });

  const warnings: string[] = [];
  if (config.thicknessMm < 3) warnings.push("Ketebalan minimum 3 mm untuk mengurangi risiko patah.");
  if (config.productType === "keychain" && config.holeDiameterMm < 4) warnings.push("Diameter lubang keychain minimum 4 mm.");
  if (config.widthMm < 35 || config.heightMm < 20) warnings.push("Ukuran terlalu kecil, detail logo/teks bisa tidak terbaca.");
  if (config.thicknessMm < 4 && ["phone_stand", "desk_organizer", "trophy"].includes(config.productType)) warnings.push("Part struktural terlalu tipis, gunakan thickness minimal 4 mm.");

  return {
    materialGram,
    printTimeHour,
    basePrice: product.basePrice * config.quantity,
    finishingFee,
    total: pricing.total,
    warnings,
    isValid: warnings.length === 0
  };
}
