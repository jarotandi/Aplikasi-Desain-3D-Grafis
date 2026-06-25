import { eventPackages } from "@/lib/bulk-order/package-rules";
import { productKnowledge } from "@/lib/data/products";
import { products } from "@/lib/data/products";
import type { AIInput, AIProvider, AIResponse } from "@/lib/ai/types";
import type { ProductKnowledge } from "@/types";

function getKnowledgeRecords(): ProductKnowledge[] {
  if (typeof window === "undefined") return productKnowledge;
  const raw = window.localStorage.getItem("merchdesign-product-knowledge");
  if (!raw) return productKnowledge;
  try {
    return JSON.parse(raw) as ProductKnowledge[];
  } catch {
    return productKnowledge;
  }
}

function numberFromText(text: string, fallback: number) {
  const normalized = text.replace(/\./g, "").replace(/,/g, "");
  const match = normalized.match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function budgetFromText(text: string) {
  const normalized = text.toLowerCase().replace(/\./g, "").replace(/,/g, "");
  const million = normalized.match(/(\d+)\s*(juta|jt)/);
  if (million) return Number(million[1]) * 1_000_000;
  const raw = normalized.match(/\d{6,}/);
  return raw ? Number(raw[0]) : 15_000_000;
}

function productNames(ids: string[]) {
  return ids.map((id) => products.find((product) => product.id === id)?.name).filter(Boolean).join(", ");
}

export class LocalRuleBasedAIProvider implements AIProvider {
  async generateResponse(input: AIInput): Promise<AIResponse> {
    const text = input.message.toLowerCase();
    const knowledge = getKnowledgeRecords();

    if (text.includes("seminar") || text.includes("event") || text.includes("peserta") || text.includes("orang")) {
      const participantCount = numberFromText(text, 200);
      const budget = budgetFromText(text);
      const perPerson = budget / Math.max(participantCount, 1);
      const packageId = perPerson >= 150_000 ? "premium" : perPerson >= 75_000 ? "standard" : "basic";
      const productIds = eventPackages[packageId].productSlugs.map((slug) => products.find((product) => product.slug === slug)?.id).filter(Boolean) as string[];
      return {
        intent: text.includes("budget") || text.includes("juta") ? "budget_estimation" : "event_recommendation",
        confidence: 0.9,
        sources: ["event-package-rules", "product-knowledge", "pricing-rules"],
        recommendations: { productIds, estimatedBudget: budget },
        message: `Untuk ${participantCount} peserta dengan estimasi budget ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(budget)}, pilihan paling realistis adalah ${eventPackages[packageId].name}: ${productNames(productIds)}. Perkiraan budget per peserta sekitar ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(perPerson)}.`
      };
    }

    if (text.includes("full color") || text.includes("gradasi") || text.includes("metode cetak") || text.includes("print")) {
      return {
        intent: "print_method",
        confidence: 0.91,
        sources: ["print-method-rules", "product-knowledge"],
        recommendations: { printMethods: ["DTF", "DTG", "Sublimation", "UV Print", "Digital Print"] },
        message: "Untuk desain full color, foto, atau gradasi, gunakan DTF/DTG untuk clothing, sublimation untuk mug/lanyard, UV print untuk tumbler, dan digital/offset print untuk packaging. Untuk qty kecil-menengah, DTF biasanya lebih ekonomis dibanding sablon manual banyak warna."
      };
    }

    if (text.includes("warning") || text.includes("validasi") || text.includes("safe zone") || text.includes("bleed") || text.includes("resolusi")) {
      const warnings = knowledge.flatMap((item) => item.warnings).slice(0, 5);
      return {
        intent: "design_warning",
        confidence: 0.86,
        sources: ["design-validator", "product-knowledge"],
        recommendations: { warnings },
        message: `Validasi utama: gunakan file 300 DPI, pastikan desain masuk printable area, ikuti safe zone/bleed, dan perhatikan warning produksi: ${warnings.join("; ")}.`
      };
    }

    if (text.includes("alternatif") || text.includes("lebih murah") || text.includes("hemat")) {
      const affordable = products.filter((product) => product.startingPrice <= 35_000).slice(0, 5);
      return {
        intent: "alternative_product",
        confidence: 0.82,
        sources: ["product-catalog", "pricing-rules"],
        recommendations: { productIds: affordable.map((product) => product.id) },
        message: `Alternatif produk yang lebih hemat: ${affordable.map((product) => `${product.name} mulai ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(product.startingPrice)}`).join(", ")}.`
      };
    }

    if (text.includes("3d") || text.includes("printing") || text.includes("keychain") || text.includes("trophy")) {
      return {
        intent: "3d_printing",
        confidence: 0.88,
        sources: ["3d-printing-rules", "product-knowledge"],
        recommendations: { productIds: products.filter((product) => product.category === "3D Printing").map((product) => product.id), warnings: ["Minimum thickness 3 mm", "Hole keychain minimum 4 mm", "Thin parts may break"] },
        message: "Untuk 3D printing, PLA paling ekonomis, PETG lebih kuat, dan resin cocok untuk detail halus. Keychain perlu thickness minimal 3 mm dan lubang minimal 4 mm. Trophy/logo stand sebaiknya diberi base cukup lebar agar stabil."
      };
    }

    if (text.includes("packaging") || text.includes("umkm") || text.includes("label") || text.includes("makanan") || text.includes("kopi")) {
      const packaging = products.filter((product) => product.category === "Packaging" || product.category === "F&B Branding");
      return {
        intent: "packaging",
        confidence: 0.84,
        sources: ["product-knowledge", "packaging-rules"],
        recommendations: { productIds: packaging.map((product) => product.id) },
        message: `Untuk packaging UMKM, mulai dari ${packaging.map((product) => product.name).join(", ")}. Gunakan bleed 3 mm, PDF print-ready, dan siapkan dieline jika bentuk box custom.`
      };
    }

    const matched = input.productId ? products.find((product) => product.id === input.productId) : null;
    const record = input.productId ? knowledge.find((item) => item.productId === input.productId) : null;
    const fallbackProducts = products.slice(0, 4);
    return {
      intent: "general",
      confidence: 0.72,
      sources: ["product-knowledge", "fallback-rules"],
      recommendations: { productIds: matched ? [matched.id] : fallbackProducts.map((product) => product.id) },
      message: matched && record ? `${matched.name}: ${record.aiContext}. File requirement: ${record.fileRequirements.join(", ")}. Warning: ${record.warnings.join(", ")}.` : `Saya merekomendasikan mulai dari ${fallbackProducts.map((product) => product.name).join(", ")}. Beri tahu jumlah, deadline, budget, dan tipe event agar rekomendasi lebih presisi.`
    };
  }
}
