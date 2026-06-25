"use client";

import { ImagePlus, Shirt } from "lucide-react";
import { useState } from "react";
import { productTemplates } from "@/lib/data/productTemplates";
import type { PrintableAreaId, ProductMockupType } from "@/lib/types/studio";
import { useStudioStore } from "@/lib/store/studioStore";
import { cn } from "@/lib/utils";

export function ProductMockupPanel() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<ProductMockupType>("t-shirt");
  const [selectedAreaId, setSelectedAreaId] = useState<PrintableAreaId>("front");
  const addProductTemplate = useStudioStore((state) => state.addProductTemplate);
  const addDecalToPrintableArea = useStudioStore((state) => state.addDecalToPrintableArea);
  const selectedTemplate = productTemplates.find((template) => template.id === selectedTemplateId) ?? productTemplates[0];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {productTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => {
              setSelectedTemplateId(template.id);
              setSelectedAreaId(template.printableAreas[0]?.id ?? "front");
            }}
            className={cn(
              "rounded-md border px-3 py-2 text-left text-xs transition",
              selectedTemplateId === template.id ? "border-emerald-400/70 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-emerald-400/40"
            )}
          >
            <div className="flex items-center gap-2">
              <Shirt className="h-3.5 w-3.5" />
              <span>{template.name}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{template.category}</div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addProductTemplate(selectedTemplate.id)}
        className="w-full rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-100 hover:bg-emerald-400/15"
      >
        Add {selectedTemplate.name} Placeholder
      </button>

      <div className="rounded-md border border-white/10 bg-slate-900/60 p-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Printable Area</div>
        <select
          value={selectedAreaId}
          onChange={(event) => setSelectedAreaId(event.target.value as PrintableAreaId)}
          className="h-9 w-full rounded-md border border-white/10 bg-slate-950 px-2 text-xs text-slate-200 outline-none"
        >
          {selectedTemplate.printableAreas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-white/15 bg-slate-950 px-3 py-3 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10">
          <ImagePlus className="h-4 w-4" />
          Upload design to area
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => addDecalToPrintableArea(selectedTemplate.id, selectedAreaId, String(reader.result), file.name.replace(/\.(png|jpg|jpeg)$/i, ""));
              reader.readAsDataURL(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="rounded-md border border-white/10 bg-slate-900/50 p-3 text-[11px] text-slate-500">
        <div>Sizes: {selectedTemplate.sizeOptions.join(", ")}</div>
        <div className="mt-1">Materials: {selectedTemplate.materialOptions.join(", ")}</div>
      </div>
    </div>
  );
}
