"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { AlertTriangle, Box, Download, FileArchive, Upload, Wand2 } from "lucide-react";
import { PrintingPreview } from "@/components/three/printing-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { applyProductDefaults, defaultThreeDConfig, estimateThreeDPrinting, materialProfiles, threeDProducts } from "@/lib/three-d-printing/estimator";
import type { ThreeDMaterial, ThreeDPrintingConfig, ThreeDProductType } from "@/lib/three-d-printing/types";
import { formatCurrency } from "@/lib/utils";

export function PrintingCustomizer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [config, setConfig] = useState<ThreeDPrintingConfig>(() => defaultThreeDConfig());
  const [notes, setNotes] = useState("Logo dibuat emboss ringan. Finishing matte, warna mengikuti brand.");
  const estimate = useMemo(() => estimateThreeDPrinting(config), [config]);

  function update<K extends keyof ThreeDPrintingConfig>(key: K, value: ThreeDPrintingConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function changeProduct(productType: ThreeDProductType) {
    setConfig((current) => applyProductDefaults(current, productType));
  }

  function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    update("logoFileName", file.name);
    event.target.value = "";
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr_340px]">
      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi 3D Print</CardTitle>
          <p className="text-sm text-muted-foreground">Input text, logo placeholder, material, warna, ukuran, dan thickness.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Produk
            <SelectNative value={config.productType} onChange={(event) => changeProduct(event.target.value as ThreeDProductType)}>
              {(Object.keys(threeDProducts) as ThreeDProductType[]).map((key) => (
                <option key={key} value={key}>
                  {threeDProducts[key].label}
                </option>
              ))}
            </SelectNative>
          </label>

          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Teks 3D
            <Input value={config.text} onChange={(event) => update("text", event.target.value)} />
          </label>

          <div>
            <input ref={fileInputRef} type="file" accept="image/*,.svg" onChange={handleLogoUpload} className="hidden" />
            <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload Logo Placeholder
            </Button>
            <p className="mt-2 text-xs text-slate-500">{config.logoFileName ?? "Belum ada logo. Preview memakai teks 3D."}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              Material
              <SelectNative value={config.material} onChange={(event) => update("material", event.target.value as ThreeDMaterial)}>
                {(Object.keys(materialProfiles) as ThreeDMaterial[]).map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </SelectNative>
            </label>
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              Warna
              <Input type="color" value={config.color} onChange={(event) => update("color", event.target.value)} className="h-11 p-1" />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <NumberField label="Width mm" value={config.widthMm} onChange={(value) => update("widthMm", value)} />
            <NumberField label="Height mm" value={config.heightMm} onChange={(value) => update("heightMm", value)} />
            <NumberField label="Depth mm" value={config.depthMm} onChange={(value) => update("depthMm", value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Thickness mm" value={config.thicknessMm} min={1} step={0.5} onChange={(value) => update("thicknessMm", value)} />
            <NumberField label="Hole diameter mm" value={config.holeDiameterMm} min={0} step={0.5} onChange={(value) => update("holeDiameterMm", value)} />
          </div>

          <NumberField label="Quantity" value={config.quantity} min={1} step={1} onChange={(value) => update("quantity", value)} />

          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Production Notes
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>
        </CardContent>
      </Card>

      <Card className="overflow-hidden p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold">Preview 3D</p>
            <p className="text-sm text-slate-500">{threeDProducts[config.productType].label} - {config.material}</p>
          </div>
          <Badge>{estimate.isValid ? "Production ready draft" : "Needs revision"}</Badge>
        </div>
        <div className="h-[620px] overflow-hidden rounded-[2rem] border bg-slate-50">
          <PrintingPreview config={config} />
        </div>
      </Card>

      <aside className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Estimasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Metric label="Material weight" value={`${estimate.materialGram} g / pcs`} />
            <Metric label="Print time" value={`${estimate.printTimeHour} jam / pcs`} />
            <Metric label="Base price" value={formatCurrency(estimate.basePrice)} />
            <Metric label="Finishing" value={formatCurrency(estimate.finishingFee)} />
            <Metric label="Total estimate" value={formatCurrency(estimate.total)} dark />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Validation</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {estimate.warnings.length ? (
              estimate.warnings.map((warning) => (
                <div key={warning} className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {warning}
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Validasi lolos: thickness dan hole diameter aman untuk estimasi awal.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-5">
            <Button className="w-full">
              <Wand2 className="h-4 w-4" />
              Request Quote / Order
            </Button>
            <Button className="w-full" variant="outline" disabled>
              <FileArchive className="h-4 w-4" />
              Export STL - Coming Soon
            </Button>
            <Button className="w-full" variant="outline" disabled>
              <Download className="h-4 w-4" />
              Download Spec PDF
            </Button>
          </CardContent>
        </Card>

        <div className="rounded-2xl bg-[#1a1a2e] p-4 text-sm leading-6 text-white">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <Box className="h-4 w-4" />
            STL pipeline
          </div>
          Export STL disiapkan sebagai future feature. Untuk production, geometri R3F dapat diganti pipeline Three.js STLExporter.
        </div>
      </aside>
    </div>
  );
}

function NumberField({ label, value, min = 0, step = 1, onChange }: { label: string; value: number; min?: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-xs font-semibold text-slate-500">
      {label}
      <Input type="number" min={min} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${dark ? "bg-[#1a1a2e] text-white" : "bg-slate-50"}`}>
      <p className={`text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
