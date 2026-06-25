"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useStudio3DStore } from "@/store/studio3dStore";

export function OrderQuotationPanel() {
  const [quantity, setQuantity] = useState(24);
  const quotation = useStudio3DStore((state) => state.currentQuotation);
  const createQuotation = useStudio3DStore((state) => state.createQuotation);

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Order & Quotation</h2>
      <div className="space-y-3 rounded-md border border-white/10 bg-zinc-900/60 p-3">
        <label className="block text-xs text-zinc-400">Quantity<input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="mt-1 h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-200" /></label>
        <button onClick={() => createQuotation(quantity)} className="w-full rounded-md bg-emerald-400 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-300">Create Quotation</button>
        {quotation ? (
          <div className="rounded-md bg-zinc-950 p-3 text-xs text-zinc-300">
            <div>Status: {quotation.status}</div>
            <div>Material: {formatCurrency(quotation.materialCost)}</div>
            <div>Production: {formatCurrency(quotation.productionCost)}</div>
            <div>Margin: {formatCurrency(quotation.margin)}</div>
            <div>Tax: {formatCurrency(quotation.tax)}</div>
            <div className="mt-2 text-sm font-semibold text-emerald-200">Total: {formatCurrency(quotation.totalPrice)}</div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
