export function recommendEventPackage(participantCount: number, budgetMax: number) {
  const perPersonBudget = budgetMax / Math.max(participantCount, 1);
  if (perPersonBudget >= 150000) return "Premium Package";
  if (perPersonBudget >= 75000) return "Standard Package";
  return "Basic Package";
}
