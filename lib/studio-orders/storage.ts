"use client";

import type { StudioQuotationRequest } from "@/lib/types/studioOrder";

export const STUDIO_ORDERS_KEY = "3d-product-studio-quotations";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function listStudioQuotations() {
  return readJson<StudioQuotationRequest[]>(STUDIO_ORDERS_KEY, []);
}

export function saveStudioQuotation(quotation: StudioQuotationRequest) {
  const quotations = listStudioQuotations();
  const next = quotations.some((item) => item.id === quotation.id) ? quotations.map((item) => (item.id === quotation.id ? quotation : item)) : [quotation, ...quotations];
  writeJson(STUDIO_ORDERS_KEY, next);
  return quotation;
}

export function createStudioQuotationNumber() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const sequence = String(listStudioQuotations().length + 1).padStart(4, "0");
  return `3DQ-${yyyy}${mm}-${sequence}`;
}
