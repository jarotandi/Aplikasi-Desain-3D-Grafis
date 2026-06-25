export type ThreeDProductType = "keychain" | "logo_stand" | "name_plate" | "trophy" | "plaque" | "phone_stand" | "desk_organizer";

export type ThreeDMaterial = "PLA" | "PETG" | "ABS" | "Resin";

export type ThreeDPrintingConfig = {
  productType: ThreeDProductType;
  text: string;
  logoFileName?: string;
  material: ThreeDMaterial;
  color: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  thicknessMm: number;
  holeDiameterMm: number;
  quantity: number;
};

export type ThreeDPrintingEstimate = {
  materialGram: number;
  printTimeHour: number;
  basePrice: number;
  finishingFee: number;
  total: number;
  warnings: string[];
  isValid: boolean;
};
