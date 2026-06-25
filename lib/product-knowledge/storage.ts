import { productKnowledge } from "@/lib/data/products";
import type { ProductKnowledge } from "@/types";

const PRODUCT_KNOWLEDGE_KEY = "merchdesign-product-knowledge";

function cloneSeed() {
  return productKnowledge.map((item) => ({ ...item, faq: item.faq.map((faq) => ({ ...faq })) }));
}

export function listProductKnowledge(): ProductKnowledge[] {
  if (typeof window === "undefined") return cloneSeed();
  const raw = window.localStorage.getItem(PRODUCT_KNOWLEDGE_KEY);
  if (!raw) {
    const seed = cloneSeed();
    window.localStorage.setItem(PRODUCT_KNOWLEDGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as ProductKnowledge[];
  } catch {
    return cloneSeed();
  }
}

export function saveProductKnowledge(record: ProductKnowledge) {
  const current = listProductKnowledge();
  const next = current.some((item) => item.productId === record.productId)
    ? current.map((item) => (item.productId === record.productId ? record : item))
    : [record, ...current];
  window.localStorage.setItem(PRODUCT_KNOWLEDGE_KEY, JSON.stringify(next));
  return record;
}

export function deleteProductKnowledge(productId: string) {
  const next = listProductKnowledge().filter((item) => item.productId !== productId);
  window.localStorage.setItem(PRODUCT_KNOWLEDGE_KEY, JSON.stringify(next));
  return next;
}

export function importProductKnowledge(records: ProductKnowledge[]) {
  window.localStorage.setItem(PRODUCT_KNOWLEDGE_KEY, JSON.stringify(records));
  return records;
}

export function exportProductKnowledgeJson() {
  return JSON.stringify(listProductKnowledge(), null, 2);
}
