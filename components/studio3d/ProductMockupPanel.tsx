"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { defaultProducts } from "@/data/defaultProducts";
import { useStudio3DStore } from "@/store/studio3dStore";

export function ProductMockupPanel() {
  const [productId, setProductId] = useState(defaultProducts[0].id);
  const [areaId, setAreaId] = useState(defaultProducts[0].printableAreas[0].id);
  const addObject = useStudio3DStore((state) => state.addObject);
  const selectedProduct = defaultProducts.find((product) => product.id === productId) ?? defaultProducts[0];
  const selectedArea = selectedProduct.printableAreas.find((area) => area.id === areaId) ?? selectedProduct.printableAreas[0];

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Product Mockup</h2>
      <div className="space-y-3 rounded-md border border-white/10 bg-zinc-900/60 p-3">
        <select value={productId} onChange={(event) => { const product = defaultProducts.find((item) => item.id === event.target.value) ?? defaultProducts[0]; setProductId(product.id); setAreaId(product.printableAreas[0].id); }} className="h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200">
          {defaultProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
        </select>
        <button onClick={() => addObject((selectedProduct.metadata.placeholderGeometry as "box" | "sphere" | "cylinder" | "plane") ?? "box", { name: selectedProduct.name, type: "mockup", materialId: "mat-cotton", metadata: { productModel: selectedProduct } })} className="w-full rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-100 hover:bg-emerald-400/15">Add product model</button>
        <select value={areaId} onChange={(event) => setAreaId(event.target.value)} className="h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200">
          {selectedProduct.printableAreas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
        </select>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-white/15 bg-zinc-950 px-3 py-3 text-xs text-zinc-300 hover:border-cyan-400/50">
          <ImagePlus className="h-4 w-4" /> Upload design
          <input type="file" accept="image/png,image/svg+xml,image/jpeg" className="hidden" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => addObject("decal", { name: `${file.name} / ${selectedArea.name}`, type: "decal", position: selectedArea.position, rotation: selectedArea.rotation, dimensions: { width: selectedArea.width, height: selectedArea.height, depth: 0.01 }, materialId: "mat-acrylic", metadata: { designDataUrl: reader.result, productId, areaId } });
            reader.readAsDataURL(file);
          }} />
        </label>
      </div>
    </section>
  );
}
