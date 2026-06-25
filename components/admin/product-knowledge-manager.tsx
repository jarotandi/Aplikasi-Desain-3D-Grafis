"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Download, Edit3, Plus, Save, Sparkles, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { products } from "@/lib/data/products";
import { deleteProductKnowledge, exportProductKnowledgeJson, importProductKnowledge, listProductKnowledge, saveProductKnowledge } from "@/lib/product-knowledge/storage";
import type { ProductKnowledge } from "@/types";

const emptyKnowledge = (productId: string): ProductKnowledge => ({
  productId,
  designAreas: ["Front area"],
  safeZone: "2 cm dari tepi area cetak",
  bleed: "3 mm bleed untuk packaging",
  maxPrintSize: "Sesuai ukuran produk",
  fileRequirements: ["PNG transparent 300 DPI", "SVG", "PDF"],
  pricingRules: ["qty >= 50 discount 10%", "rush order +20%"],
  productionConstraints: ["Artwork harus masuk printable area"],
  recommendedUseCases: ["Event", "UMKM", "Corporate merchandise"],
  warnings: ["Hindari desain terlalu dekat tepi jahitan atau garis potong"],
  faq: [{ question: "Apakah bisa custom?", answer: "Bisa, mengikuti MOQ dan file requirement." }],
  aiContext: "Produk cocok untuk event, UMKM, dan corporate merchandise."
});

const splitLines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
const joinLines = (value: string[]) => value.join("\n");

export function ProductKnowledgeManager() {
  const importRef = useRef<HTMLInputElement | null>(null);
  const [records, setRecords] = useState<ProductKnowledge[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [draft, setDraft] = useState<ProductKnowledge>(() => emptyKnowledge(products[0].id));
  const [status, setStatus] = useState("Product knowledge memakai localStorage fallback.");

  useEffect(() => {
    queueMicrotask(() => {
      const data = listProductKnowledge();
      setRecords(data);
      const first = data[0] ?? emptyKnowledge(products[0].id);
      setSelectedProductId(first.productId);
      setDraft(first);
    });
  }, []);

  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedProductId) ?? products[0], [selectedProductId]);

  function selectRecord(productId: string) {
    const record = records.find((item) => item.productId === productId) ?? emptyKnowledge(productId);
    setSelectedProductId(productId);
    setDraft(record);
  }

  function updateArrayField(field: keyof Pick<ProductKnowledge, "designAreas" | "fileRequirements" | "pricingRules" | "productionConstraints" | "recommendedUseCases" | "warnings">, value: string) {
    setDraft((current) => ({ ...current, [field]: splitLines(value) }));
  }

  function updateScalar(field: keyof Pick<ProductKnowledge, "safeZone" | "bleed" | "maxPrintSize" | "aiContext">, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateFaq(value: string) {
    const faq = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [question, ...answer] = line.split("|");
        return { question: question?.trim() || "Pertanyaan", answer: answer.join("|").trim() || "Jawaban belum diisi." };
      });
    setDraft((current) => ({ ...current, faq }));
  }

  function saveDraft() {
    const saved = saveProductKnowledge({ ...draft, productId: selectedProductId });
    setRecords(listProductKnowledge());
    setDraft(saved);
    setStatus(`Knowledge ${selectedProduct.name} tersimpan.`);
  }

  function createForSelectedProduct() {
    const record = emptyKnowledge(selectedProductId);
    setDraft(record);
    setStatus(`Draft knowledge baru untuk ${selectedProduct.name}.`);
  }

  function removeRecord(productId: string) {
    const next = deleteProductKnowledge(productId);
    setRecords(next);
    const first = next[0] ?? emptyKnowledge(products[0].id);
    setSelectedProductId(first.productId);
    setDraft(first);
    setStatus("Knowledge dihapus dari localStorage fallback.");
  }

  function exportJson() {
    const blob = new Blob([exportProductKnowledgeJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-knowledge-export.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = JSON.parse(String(reader.result)) as ProductKnowledge[];
      const imported = importProductKnowledge(parsed);
      setRecords(imported);
      setDraft(imported[0] ?? emptyKnowledge(products[0].id));
      setSelectedProductId(imported[0]?.productId ?? products[0].id);
      setStatus(`${imported.length} knowledge records di-import.`);
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-bold">Knowledge Records</p>
            <p className="text-xs text-slate-500">{records.length} produk punya knowledge.</p>
          </div>
          <Button size="icon" variant="outline" onClick={createForSelectedProduct} aria-label="Create">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-4 grid gap-2">
          <SelectNative value={selectedProductId} onChange={(event) => selectRecord(event.target.value)}>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </SelectNative>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={exportJson}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={() => importRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
          <Button asChild>
            <Link href="/admin/product-knowledge/ai-advisor">
              <Sparkles className="h-4 w-4" />
              Open AI Advisor
            </Link>
          </Button>
          <input ref={importRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </div>
        <div className="space-y-2">
          {records.map((item) => {
            const product = products.find((entry) => entry.id === item.productId);
            return (
              <button key={item.productId} onClick={() => selectRecord(item.productId)} className={`w-full rounded-2xl p-3 text-left transition ${item.productId === selectedProductId ? "brand-gradient text-white shadow-panel" : "bg-slate-50 text-slate-600 hover:bg-white"}`}>
                <p className="font-semibold">{product?.name ?? item.productId}</p>
                <p className="mt-1 line-clamp-2 text-xs opacity-75">{item.aiContext}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#6c63ff]" />
              Edit Knowledge: {selectedProduct.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => removeRecord(selectedProductId)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button onClick={saveDraft}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              Safe Zone
              <Input value={draft.safeZone} onChange={(event) => updateScalar("safeZone", event.target.value)} />
            </label>
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              Bleed
              <Input value={draft.bleed} onChange={(event) => updateScalar("bleed", event.target.value)} />
            </label>
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              Max Print Size
              <Input value={draft.maxPrintSize} onChange={(event) => updateScalar("maxPrintSize", event.target.value)} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextAreaField label="Design Areas" value={joinLines(draft.designAreas)} onChange={(value) => updateArrayField("designAreas", value)} />
            <TextAreaField label="File Requirements" value={joinLines(draft.fileRequirements)} onChange={(value) => updateArrayField("fileRequirements", value)} />
            <TextAreaField label="Pricing Notes" value={joinLines(draft.pricingRules)} onChange={(value) => updateArrayField("pricingRules", value)} />
            <TextAreaField label="Production Constraints" value={joinLines(draft.productionConstraints)} onChange={(value) => updateArrayField("productionConstraints", value)} />
            <TextAreaField label="Recommended Use Cases" value={joinLines(draft.recommendedUseCases)} onChange={(value) => updateArrayField("recommendedUseCases", value)} />
            <TextAreaField label="Warnings" value={joinLines(draft.warnings)} onChange={(value) => updateArrayField("warnings", value)} />
          </div>

          <TextAreaField label="FAQ (format: question | answer, satu baris per FAQ)" value={draft.faq.map((item) => `${item.question} | ${item.answer}`).join("\n")} onChange={updateFaq} />

          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            AI Context Field
            <Textarea className="min-h-32" value={draft.aiContext} onChange={(event) => updateScalar("aiContext", event.target.value)} />
          </label>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <Edit3 className="h-4 w-4 text-[#6c63ff]" />
              AI-ready context preview
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {selectedProduct.name}. Material: {selectedProduct.materials.join(", ")}. Print methods: {selectedProduct.printMethods.join(", ")}. {draft.aiContext}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-semibold text-slate-500">
      {label}
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
