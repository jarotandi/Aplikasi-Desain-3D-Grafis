import { NextResponse } from "next/server";
import type { DesignAssistantSuggestion } from "@/lib/types/studio";

export const runtime = "nodejs";

function detectProduct(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes("hoodie")) return "Hoodie";
  if (lower.includes("jersey") || lower.includes("futsal") || lower.includes("bola")) return "Jersey";
  if (lower.includes("mug")) return "Mug";
  if (lower.includes("tumbler")) return "Tumbler";
  if (lower.includes("tote")) return "Tote Bag";
  if (lower.includes("cap") || lower.includes("topi")) return "Cap";
  return "T-shirt";
}

function detectPalette(prompt: string): DesignAssistantSuggestion["colorPalette"] {
  const lower = prompt.toLowerCase();
  if (lower.includes("hitam") && (lower.includes("emas") || lower.includes("gold"))) {
    return [
      { name: "Deep Black", hex: "#050505", usage: "Base product color" },
      { name: "Metallic Gold", hex: "#d4af37", usage: "Primary logo and accent lines" },
      { name: "Warm White", hex: "#f8fafc", usage: "Small text and numbering" }
    ];
  }
  if (lower.includes("biru")) {
    return [
      { name: "Royal Blue", hex: "#2563eb", usage: "Base product color" },
      { name: "Ice Cyan", hex: "#67e8f9", usage: "Graphic highlight" },
      { name: "White", hex: "#ffffff", usage: "Readable typography" }
    ];
  }
  return [
    { name: "Slate", hex: "#1e293b", usage: "Base product color" },
    { name: "Signal Cyan", hex: "#22d3ee", usage: "Main artwork accent" },
    { name: "Soft White", hex: "#f8fafc", usage: "Text and logo contrast" }
  ];
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { prompt?: string; sceneData?: unknown } | null;

  if (!body?.prompt?.trim()) {
    return NextResponse.json({ message: "prompt is required." }, { status: 400 });
  }

  const prompt = body.prompt.trim();
  const suggestedProduct = detectProduct(prompt);
  const colorPalette = detectPalette(prompt);

  const suggestion: DesignAssistantSuggestion = {
    suggestedProduct,
    colorPalette,
    layoutSuggestion:
      "Gunakan komposisi utama di area front dengan logo besar di dada tengah, aksen garis diagonal tipis, dan detail kecil di sleeve kanan agar tetap terlihat premium saat dipreview 3D.",
    materialSuggestion:
      suggestedProduct === "Hoodie"
        ? "Fleece 280-320 gsm dengan sablon DTF premium atau rubber high-density untuk aksen logo."
        : suggestedProduct === "Jersey"
          ? "Dryfit Milano atau Serena dengan sublim printing untuk warna solid dan tahan cuci."
          : "Material standar premium sesuai produk dengan finishing matte agar desain terlihat bersih.",
    logoPositionSuggestion: "Tempatkan logo utama di printable area front, versi kecil di label/back neck, dan elemen komunitas di left sleeve atau right sleeve.",
    estimatedProductionNotes:
      "Estimasi awal: cocok untuk batch 24-50 pcs. Biaya dipengaruhi bahan, jumlah warna, ukuran area cetak, dan finishing. Gunakan quotation engine untuk harga final produksi.",
    promptForImageGeneration: `Premium product mockup design for ${suggestedProduct}, theme: ${prompt}, color palette ${colorPalette.map((color) => `${color.name} ${color.hex}`).join(", ")}, clean vector logo layout, production-ready merchandise artwork, front print composition.`
  };

  return NextResponse.json({
    status: "ok",
    mode: "mock",
    suggestion
  });
}
