"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileText, Package, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuotation } from "@/lib/bulk-order/storage";
import type { BulkQuotationRecord } from "@/lib/bulk-order/types";
import { formatCurrency } from "@/lib/utils";

function fallbackQuotation(id: string): BulkQuotationRecord {
  const now = new Date().toISOString();
  return {
    id,
    user_id: "local-user",
    bulk_event_order_id: "fallback",
    quotation_number: "QTN-MDS-DEMO",
    event_info: {
      eventType: "Seminar",
      eventName: "Demo Seminar Nasional",
      eventDate: "2026-06-15",
      location: "Jakarta",
      deadline: "2026-06-08",
      participantCount: 200,
      budgetMin: 10_000_000,
      budgetMax: 15_000_000
    },
    selected_package: "standard",
    items: [],
    size_breakdown: { S: 30, M: 55, L: 65, XL: 35, XXL: 15, custom: 0 },
    subtotal: 12_500_000,
    discount: 1_250_000,
    rush_fee: 0,
    design_fee: 250_000,
    setup_fee: 50_000,
    print_fee: 2_000_000,
    finishing_fee: 0,
    shipping_fee: 450_000,
    tax: 1_300_000,
    margin: 2_100_000,
    total: 15_350_000,
    dp_amount: 7_675_000,
    remaining_amount: 7_675_000,
    terms: "DP 50%, pelunasan sebelum pengiriman, desain dikunci setelah approval.",
    valid_until: "2026-06-01",
    status: "waiting_admin_review",
    production_timeline: { designReviewDays: 2, productionDaysMin: 7, productionDaysMax: 10, qcDays: 1, estimatedReadyDate: "2026-06-12" },
    notes: ["Demo quotation. Submit dari Bulk Event Order untuk data real localStorage."],
    created_at: now,
    updated_at: now
  };
}

export function QuotationDetail({ quotationId }: { quotationId: string }) {
  const [quotation, setQuotation] = useState<BulkQuotationRecord | null>(null);

  useEffect(() => {
    queueMicrotask(() => setQuotation(getQuotation(quotationId) ?? fallbackQuotation(quotationId)));
  }, [quotationId]);

  const priceRows = useMemo(() => {
    if (!quotation) return [];
    return [
      ["Product subtotal", quotation.subtotal],
      ["Print fee", quotation.print_fee],
      ["Setup fee", quotation.setup_fee],
      ["Finishing fee", quotation.finishing_fee],
      ["Rush fee", quotation.rush_fee],
      ["Discount", -quotation.discount],
      ["Design fee", quotation.design_fee],
      ["Shipping fee", quotation.shipping_fee],
      ["Tax 11%", quotation.tax],
      ["Margin", quotation.margin],
      ["Total", quotation.total],
      ["DP 50%", quotation.dp_amount],
      ["Remaining", quotation.remaining_amount]
    ] as const;
  }, [quotation]);

  if (!quotation) {
    return <div className="rounded-2xl bg-white p-6 shadow-soft">Memuat quotation...</div>;
  }

  const sizeTotal = Object.values(quotation.size_breakdown).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="capitalize">{quotation.status.replaceAll("_", " ")}</Badge>
              <Badge>{quotation.selected_package.toUpperCase()} PACKAGE</Badge>
            </div>
            <h2 className="mt-4 text-3xl font-bold">{quotation.quotation_number}</h2>
            <p className="mt-2 text-muted-foreground">{quotation.event_info.eventName} - {quotation.event_info.eventType}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Total</p><p className="text-2xl font-bold">{formatCurrency(quotation.total)}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">DP 50%</p><p className="text-2xl font-bold">{formatCurrency(quotation.dp_amount)}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Valid until</p><p className="text-2xl font-bold">{quotation.valid_until}</p></div>
            </div>
          </div>
          <div className="brand-gradient p-6 text-white">
            <FileText className="mb-4 h-10 w-10" />
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Quotation terms</p>
            <p className="mt-3 text-xl font-bold">DP 50%</p>
            <p className="mt-2 text-sm leading-6 text-white/80">{quotation.terms}</p>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="text-slate-950">Approve</Button>
              <Button variant="outline" className="text-slate-950"><Download className="h-4 w-4" /> PDF</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Event Info</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {[
                ["Event type", quotation.event_info.eventType],
                ["Event date", quotation.event_info.eventDate],
                ["Location", quotation.event_info.location],
                ["Deadline", quotation.event_info.deadline],
                ["Participants", `${quotation.event_info.participantCount} orang`],
                ["Budget range", `${formatCurrency(quotation.event_info.budgetMin)} - ${formatCurrency(quotation.event_info.budgetMax)}`]
              ].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Selected Products</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {quotation.items.length ? quotation.items.map((item) => (
                <div key={item.productId} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_100px_130px_140px]">
                  <div><p className="font-semibold">{item.productName}</p><p className="text-sm text-slate-500">{item.category} - {item.printMethod}</p></div>
                  <p>{item.quantity} pcs</p>
                  <p>{formatCurrency(item.unitPrice)}</p>
                  <p className="font-bold">{formatCurrency(item.pricing.total)}</p>
                </div>
              )) : <p className="text-sm text-slate-500">Item detail hanya tersedia untuk quotation dari wizard.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quantity & Size Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-3 text-sm text-slate-500">Total clothing size: {sizeTotal} pcs</div>
              <div className="grid gap-3 md:grid-cols-6">
                {Object.entries(quotation.size_breakdown).map(([size, value]) => <div key={size} className="rounded-2xl bg-slate-50 p-4 text-center"><p className="text-xs uppercase text-slate-400">{size}</p><p className="text-xl font-bold">{value}</p></div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Price Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {priceRows.map(([label, value]) => (
                <div key={label} className={`flex justify-between rounded-xl px-3 py-2 text-sm ${label === "Total" ? "bg-[#1a1a2e] font-bold text-white" : "bg-slate-50"}`}>
                  <span>{label}</span>
                  <span>{formatCurrency(value)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Production Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Design review", `${quotation.production_timeline.designReviewDays} hari`],
                ["Production", `${quotation.production_timeline.productionDaysMin}-${quotation.production_timeline.productionDaysMax} hari`],
                ["Quality check", `${quotation.production_timeline.qcDays} hari`],
                ["Estimated ready", quotation.production_timeline.estimatedReadyDate]
              ].map(([label, value], index) => (
                <div key={label} className="flex gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">{index + 1}</div>
                  <div><p className="font-semibold">{label}</p><p className="text-sm text-slate-500">{value}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notes & Warnings</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quotation.notes.map((note) => <div key={note} className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><AlertCircle className="h-4 w-4 shrink-0" />{note}</div>)}
              <div className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" />Status quotation: {quotation.status.replaceAll("_", " ")}</div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="flex-1"><Link href="/quotations"><Package className="h-4 w-4" />List</Link></Button>
            <Button asChild className="flex-1"><Link href="/bulk-order"><Printer className="h-4 w-4" />New Quote</Link></Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
