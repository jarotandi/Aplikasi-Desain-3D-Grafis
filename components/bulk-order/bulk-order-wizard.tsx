"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, FileText, PackageCheck, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { eventPackages, buildPackageProducts } from "@/lib/bulk-order/package-rules";
import { saveBulkOrder, saveQuotation } from "@/lib/bulk-order/storage";
import type { BulkAsset, BulkEventInfo, BulkSelectedProduct, EventPackageId, EventType, SizeBreakdown } from "@/lib/bulk-order/types";
import { products } from "@/lib/data/products";
import { buildBulkQuotation } from "@/lib/pricing/bulk-quotation";
import { formatCurrency } from "@/lib/utils";

const steps = ["Event Info", "Choose Package", "Quantity & Size", "Upload Assets", "Design Preview", "Auto Quotation", "Submit Request"];
const eventTypes: EventType[] = ["Seminar", "Corporate Gathering", "Sports Event", "Wedding", "Product Launching", "Community Event", "Restaurant/Cafe Launching", "Campus Event"];

const defaultEventInfo: BulkEventInfo = {
  eventType: "Seminar",
  eventName: "Seminar Nasional MerchDesign",
  eventDate: "2026-06-15",
  location: "Jakarta Convention Center",
  deadline: "2026-06-08",
  participantCount: 200,
  budgetMin: 10_000_000,
  budgetMax: 15_000_000
};

const defaultSizeBreakdown: SizeBreakdown = {
  S: 30,
  M: 55,
  L: 65,
  XL: 35,
  XXL: 15,
  custom: 0
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

export function BulkOrderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [eventInfo, setEventInfo] = useState<BulkEventInfo>(defaultEventInfo);
  const [selectedPackage, setSelectedPackage] = useState<EventPackageId>("standard");
  const [selectedProducts, setSelectedProducts] = useState<BulkSelectedProduct[]>(() => buildPackageProducts("standard", defaultEventInfo.participantCount));
  const [sizeBreakdown, setSizeBreakdown] = useState<SizeBreakdown>(defaultSizeBreakdown);
  const [assets, setAssets] = useState<BulkAsset[]>([]);
  const [designNotes, setDesignNotes] = useState("Gunakan warna brand, logo sponsor di belakang, dan desain full color.");

  const quotation = useMemo(
    () =>
      buildBulkQuotation({
        userId: "local-user",
        bulkOrderId: "draft-bulk-order",
        eventInfo,
        selectedPackage,
        selectedProducts,
        sizeBreakdown
      }),
    [eventInfo, selectedPackage, selectedProducts, sizeBreakdown]
  );

  function updateEventInfo<K extends keyof BulkEventInfo>(key: K, value: BulkEventInfo[K]) {
    setEventInfo((current) => {
      const next = { ...current, [key]: value };
      if (key === "participantCount") {
        setSelectedProducts(buildPackageProducts(selectedPackage, Number(value)));
      }
      return next;
    });
  }

  function choosePackage(packageId: EventPackageId) {
    setSelectedPackage(packageId);
    setSelectedProducts(buildPackageProducts(packageId, eventInfo.participantCount));
  }

  function updateProductQuantity(productId: string, quantity: number) {
    setSelectedProducts((current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }

  function updateProductMethod(productId: string, printMethod: string) {
    setSelectedProducts((current) => current.map((item) => (item.productId === productId ? { ...item, printMethod } : item)));
  }

  function updateSize(size: keyof SizeBreakdown, value: number) {
    setSizeBreakdown((current) => ({ ...current, [size]: value }));
  }

  function handleAssetUpload(label: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAssets((current) => [
      ...current.filter((asset) => asset.label !== label),
      {
        id: createId("asset"),
        label,
        fileName: file.name,
        fileType: file.type || "unknown"
      }
    ]);
    event.target.value = "";
  }

  function submitRequest() {
    const now = new Date().toISOString();
    const bulkOrderId = createId("bulk-order");
    const bulkOrder = saveBulkOrder({
      id: bulkOrderId,
      user_id: "local-user",
      event_info: eventInfo,
      selected_package: selectedPackage,
      selected_products: selectedProducts,
      size_breakdown: sizeBreakdown,
      uploaded_assets: assets,
      status: "waiting_admin_review",
      created_at: now,
      updated_at: now
    });

    const finalQuotation = buildBulkQuotation({
      userId: "local-user",
      bulkOrderId: bulkOrder.id,
      eventInfo,
      selectedPackage,
      selectedProducts,
      sizeBreakdown
    });
    saveQuotation(finalQuotation);
    router.push(`/quotations/${finalQuotation.id}`);
  }

  const totalSize = Object.values(sizeBreakdown).reduce((sum, value) => sum + value, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <Card className="p-4">
        <div className="mb-4">
          <p className="font-bold">Bulk Event Order</p>
          <p className="text-xs leading-5 text-slate-500">Wizard quotation massal berbasis product knowledge dan pricing rules.</p>
        </div>
        <div className="space-y-2">
          {steps.map((item, index) => (
            <button
              key={item}
              onClick={() => setStep(index)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${index === step ? "brand-gradient text-white shadow-panel" : index < step ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"}`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25">{index < step ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</span>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-[#1a1a2e] p-4 text-sm text-white">
          <p className="font-bold">{eventPackages[selectedPackage].name}</p>
          <p className="mt-2 text-white/70">{selectedProducts.length} produk, {eventInfo.participantCount} peserta</p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
          <p className="text-sm text-muted-foreground">Status quotation: waiting_admin_review setelah submit.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Event Type
                <SelectNative value={eventInfo.eventType} onChange={(event) => updateEventInfo("eventType", event.target.value as EventType)}>
                  {eventTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </SelectNative>
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Event Name
                <Input value={eventInfo.eventName} onChange={(event) => updateEventInfo("eventName", event.target.value)} />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Event Date
                <Input type="date" value={eventInfo.eventDate} onChange={(event) => updateEventInfo("eventDate", event.target.value)} />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Location
                <Input value={eventInfo.location} onChange={(event) => updateEventInfo("location", event.target.value)} />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Production Deadline
                <Input type="date" value={eventInfo.deadline} onChange={(event) => updateEventInfo("deadline", event.target.value)} />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Estimated Participants
                <Input type="number" value={eventInfo.participantCount} onChange={(event) => updateEventInfo("participantCount", Number(event.target.value))} />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Budget Min
                <Input type="number" value={eventInfo.budgetMin} onChange={(event) => updateEventInfo("budgetMin", Number(event.target.value))} />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-500">
                Budget Max
                <Input type="number" value={eventInfo.budgetMax} onChange={(event) => updateEventInfo("budgetMax", Number(event.target.value))} />
              </label>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(eventPackages) as EventPackageId[]).map((packageId) => (
                <button
                  key={packageId}
                  onClick={() => choosePackage(packageId)}
                  className={`rounded-[1.4rem] border p-5 text-left transition hover:-translate-y-1 ${selectedPackage === packageId ? "border-[#6c63ff] bg-violet-50 shadow-panel" : "bg-white/80"}`}
                >
                  <PackageCheck className="mb-4 h-7 w-7 text-[#6c63ff]" />
                  <p className="font-bold">{eventPackages[packageId].name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{eventPackages[packageId].description}</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-bold">Clothing Size Breakdown</p>
                  <Badge>Total size: {totalSize} pcs</Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                  {(Object.keys(sizeBreakdown) as (keyof SizeBreakdown)[]).map((size) => (
                    <label key={size} className="grid gap-2 text-xs font-semibold text-slate-500">
                      {size.toUpperCase()}
                      <Input type="number" value={sizeBreakdown[size]} onChange={(event) => updateSize(size, Number(event.target.value))} />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-bold">Product Quantities</p>
                {selectedProducts.map((item) => {
                  const product = products.find((entry) => entry.id === item.productId) ?? products[0];
                  return (
                    <div key={item.productId} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_150px_180px]">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-slate-500">MOQ {product.moq} pcs - {product.productionTime}</p>
                      </div>
                      <Input type="number" value={item.quantity} onChange={(event) => updateProductQuantity(item.productId, Number(event.target.value))} />
                      <SelectNative value={item.printMethod} onChange={(event) => updateProductMethod(item.productId, event.target.value)}>
                        {product.printMethods.map((method) => (
                          <option key={method}>{method}</option>
                        ))}
                      </SelectNative>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {["Logo", "Sponsor Logo", "Event Theme", "Reference Image", "Participant CSV/Excel"].map((label) => (
                <label key={label} className="rounded-2xl border bg-white/80 p-4">
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <Upload className="h-4 w-4 text-[#6c63ff]" />
                    {label}
                  </div>
                  <Input type="file" onChange={(event) => handleAssetUpload(label, event)} />
                  <p className="mt-2 text-xs text-slate-500">{assets.find((asset) => asset.label === label)?.fileName ?? "Belum ada file"}</p>
                </label>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
              <div className="grid min-h-96 place-items-center rounded-[2rem] bg-[radial-gradient(circle_at_top,rgb(108_99_255_/_0.16),transparent_30rem),linear-gradient(135deg,#f8fafc,#eef2f7)] p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {selectedProducts.slice(0, 6).map((item) => {
                    const product = products.find((entry) => entry.id === item.productId) ?? products[0];
                    return (
                      <div key={item.productId} className="rounded-2xl bg-white/90 p-4 text-center shadow-panel">
                        <div className="relative mx-auto mb-3 aspect-square w-28 overflow-hidden rounded-xl bg-slate-100">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="112px" />
                        </div>
                        <p className="text-sm font-bold">{product.name}</p>
                        <p className="text-xs text-slate-500">{item.quantity} pcs</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="mb-2 font-bold">Design Notes</p>
                <Textarea value={designNotes} onChange={(event) => setDesignNotes(event.target.value)} />
                <Button className="mt-3 w-full" variant="outline">
                  <Wand2 className="h-4 w-4" />
                  Request Design Help
                </Button>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["Product subtotal", quotation.subtotal],
                  ["Print fee", quotation.print_fee],
                  ["Setup fee", quotation.setup_fee],
                  ["Rush fee", quotation.rush_fee],
                  ["Design fee", quotation.design_fee],
                  ["Shipping", quotation.shipping_fee],
                  ["Tax 11%", quotation.tax],
                  ["Discount", -quotation.discount],
                  ["Total estimate", quotation.total]
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-muted-foreground">{label as string}</p>
                    <p className="mt-1 text-xl font-bold">{formatCurrency(value as number)}</p>
                  </div>
                ))}
              </div>
              <Card className="p-4">
                <p className="font-bold">Pricing notes</p>
                <div className="mt-3 grid gap-2">
                  {quotation.notes.length ? quotation.notes.map((note) => <p key={note} className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{note}</p>) : <p className="text-sm text-slate-500">Tidak ada warning khusus.</p>}
                </div>
              </Card>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="rounded-[1.6rem] bg-cyan-50 p-6">
              <FileText className="mb-3 h-9 w-9 text-cyan-700" />
              <p className="text-xl font-bold">Quotation request siap dikirim</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Request akan masuk status <strong>waiting_admin_review</strong>. Terms: DP 50%, pelunasan sebelum pengiriman, desain dikunci setelah approval.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-4"><p className="text-sm text-slate-500">Total</p><p className="text-xl font-bold">{formatCurrency(quotation.total)}</p></div>
                <div className="rounded-2xl bg-white p-4"><p className="text-sm text-slate-500">DP 50%</p><p className="text-xl font-bold">{formatCurrency(quotation.dp_amount)}</p></div>
                <div className="rounded-2xl bg-white p-4"><p className="text-sm text-slate-500">Ready estimate</p><p className="text-xl font-bold">{quotation.production_timeline.estimatedReadyDate}</p></div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3">
            <Button variant="outline" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}>
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((current) => Math.min(current + 1, steps.length - 1))}>
                Lanjut
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submitRequest}>
                <CalendarDays className="h-4 w-4" />
                Submit Request
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
