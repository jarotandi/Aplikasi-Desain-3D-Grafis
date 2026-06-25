export type DesignValidationInput = {
  dpi?: number;
  outsidePrintableArea?: boolean;
  hasTransparentBackground?: boolean;
  thicknessMm?: number;
  holeDiameterMm?: number;
};

export function validateDesign(input: DesignValidationInput) {
  const warnings: string[] = [];
  if (input.dpi && input.dpi < 300) warnings.push("Resolusi desain di bawah 300 DPI.");
  if (input.outsidePrintableArea) warnings.push("Ada elemen desain di luar printable area.");
  if (input.hasTransparentBackground === false) warnings.push("Background belum transparan untuk metode cetak tertentu.");
  if (input.thicknessMm && input.thicknessMm < 3) warnings.push("Ketebalan 3D printing minimum 3 mm.");
  if (input.holeDiameterMm && input.holeDiameterMm < 4) warnings.push("Diameter lubang keychain minimum 4 mm.");
  return { isValid: warnings.length === 0, warnings };
}
