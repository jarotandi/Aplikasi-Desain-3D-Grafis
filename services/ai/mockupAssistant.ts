export async function generateMockupIdea(productType: string, designBrief: string) {
  return { productType, designBrief, printableArea: "front", suggestion: "Center the main logo and keep secondary text below chest line." };
}
