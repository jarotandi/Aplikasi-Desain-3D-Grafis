export async function generatePricingSuggestion(input: { subtotal: number; marginPercentage?: number; taxPercentage?: number }) {
  const margin = input.subtotal * (input.marginPercentage ?? 0.25);
  const tax = input.subtotal * (input.taxPercentage ?? 0.11);
  return { margin, tax, total: input.subtotal + margin + tax };
}
