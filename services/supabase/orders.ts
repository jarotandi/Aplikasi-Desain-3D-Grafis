import type { OrderQuotation } from "@/types/order";

export async function saveStudioOrder(order: OrderQuotation) {
  return { data: order, error: null, mode: "supabase-placeholder" };
}
