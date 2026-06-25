"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { productTemplates } from "@/lib/data/productTemplates";
import { useStudioStore } from "@/lib/store/studioStore";
import type { ProductMockupType } from "@/lib/types/studio";
import type { StudioSizeBreakdown } from "@/lib/types/studioOrder";
import { createStudioQuotationNumber, saveStudioQuotation } from "@/lib/studio-orders/storage";
import { createId } from "@/lib/utils/id";

const printMethods = ["DTF", "Screen Print", "Sublimation", "Embroidery", "UV Print", "Laser Engraving"];

function parseSizeBreakdown(value: string): StudioSizeBreakdown {
  return value.split(",").reduce<StudioSizeBreakdown>((acc, part) => {
    const [rawSize, rawQty] = part.split(":").map((item) => item.trim());
    const qty = Number(rawQty);
    if (rawSize && Number.isFinite(qty) && qty > 0) acc[rawSize.toUpperCase()] = qty;
    return acc;
  }, {});
}

export function RequestQuotationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const projectId = useStudioStore((state) => state.projectId);
  const projectName = useStudioStore((state) => state.projectName);
  const objects = useStudioStore((state) => state.objects);
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const viewportSettings = useStudioStore((state) => state.viewportSettings);
  const selectedProduct = useMemo(() => objects.find((object) => object.productMockupType) ?? objects.find((object) => object.id === selectedObjectId), [objects, selectedObjectId]);
  const defaultTemplate = productTemplates.find((template) => template.id === selectedProduct?.productMockupType) ?? productTemplates[0];

  const [product, setProduct] = useState<ProductMockupType | string>(defaultTemplate.id);
  const [quantity, setQuantity] = useState(24);
  const [sizeText, setSizeText] = useState("S:4, M:8, L:8, XL:4");
  const [material, setMaterial] = useState(defaultTemplate.materialOptions[0] ?? "Standard Premium");
  const [printMethod, setPrintMethod] = useState(printMethods[0]);
  const [deadline, setDeadline] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [savedId, setSavedId] = useState<string>();

  if (!open) return null;

  const selectedTemplate = productTemplates.find((template) => template.id === product);
  const materialOptions = selectedTemplate?.materialOptions.length ? selectedTemplate.materialOptions : ["Standard Premium", "Matte Finish", "Glossy Finish"];

  const submit = () => {
    const now = new Date().toISOString();
    const quotation = saveStudioQuotation({
      id: createId("studio-quotation"),
      quotationNumber: createStudioQuotationNumber(),
      projectId,
      projectName,
      product,
      quantity,
      sizeBreakdown: parseSizeBreakdown(sizeText),
      material,
      printMethod,
      deadline,
      customerNote,
      status: "waiting_quotation",
      sceneSnapshot: {
        projectId,
        projectName,
        objects,
        selectedObjectId,
        selectedObjectIds: selectedObjectId ? [selectedObjectId] : [],
        viewportSettings
      },
      createdAt: now,
      updatedAt: now
    });
    setSavedId(quotation.id);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="text-sm font-semibold text-slate-100">Request Quotation</div>
            <div className="text-xs text-slate-500">Save a production quotation request from this 3D scene.</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {savedId ? (
          <div className="p-5">
            <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              Quotation request saved with status waiting quotation.
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
                Close
              </button>
              <Link href="/orders" className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                View Orders
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <label className="block text-xs text-slate-400">
              Product
              <select value={product} onChange={(event) => setProduct(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-200 outline-none">
                {productTemplates.map((template) => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </label>

            <label className="block text-xs text-slate-400">
              Quantity
              <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-200 outline-none" />
            </label>

            <label className="block text-xs text-slate-400">
              Size breakdown
              <input value={sizeText} onChange={(event) => setSizeText(event.target.value)} placeholder="S:4, M:8, L:8, XL:4" className="mt-1 h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-200 outline-none" />
            </label>

            <label className="block text-xs text-slate-400">
              Material
              <select value={material} onChange={(event) => setMaterial(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-200 outline-none">
                {materialOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>

            <label className="block text-xs text-slate-400">
              Print method
              <select value={printMethod} onChange={(event) => setPrintMethod(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-200 outline-none">
                {printMethods.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>

            <label className="block text-xs text-slate-400">
              Deadline
              <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-slate-900 px-3 text-sm text-slate-200 outline-none" />
            </label>

            <label className="block text-xs text-slate-400 md:col-span-2">
              Customer note
              <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} className="mt-1 h-24 w-full resize-none rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none" placeholder="Tambahkan detail produksi, referensi warna, alamat event, atau request khusus." />
            </label>

            <div className="flex justify-end gap-2 md:col-span-2">
              <button type="button" onClick={onClose} className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Cancel</button>
              <button type="button" onClick={submit} className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Submit Request</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
