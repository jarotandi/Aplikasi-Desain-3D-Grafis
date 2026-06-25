import type { BulkEventOrderRecord, BulkQuotationRecord } from "@/lib/bulk-order/types";

const BULK_ORDERS_KEY = "merchdesign-bulk-event-orders";
const QUOTATIONS_KEY = "merchdesign-bulk-quotations";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listBulkOrders() {
  return readJson<BulkEventOrderRecord[]>(BULK_ORDERS_KEY, []);
}

export function saveBulkOrder(order: BulkEventOrderRecord) {
  const orders = listBulkOrders();
  const next = orders.some((item) => item.id === order.id) ? orders.map((item) => (item.id === order.id ? order : item)) : [order, ...orders];
  writeJson(BULK_ORDERS_KEY, next);
  return order;
}

export function listQuotations() {
  return readJson<BulkQuotationRecord[]>(QUOTATIONS_KEY, []);
}

export function getQuotation(idOrNumber: string) {
  return listQuotations().find((quotation) => quotation.id === idOrNumber || quotation.quotation_number === idOrNumber) ?? null;
}

export function saveQuotation(quotation: BulkQuotationRecord) {
  const quotations = listQuotations();
  const next = quotations.some((item) => item.id === quotation.id) ? quotations.map((item) => (item.id === quotation.id ? quotation : item)) : [quotation, ...quotations];
  writeJson(QUOTATIONS_KEY, next);
  return quotation;
}
