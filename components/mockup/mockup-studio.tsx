"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Box, Camera, Download, ImageIcon, Layers3, Move, RotateCw, SlidersHorizontal } from "lucide-react";
import { MockupViewer3D } from "@/components/three/mockup-viewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { products } from "@/lib/data/products";
import { listDesignProjects, loadDesignProject, type DesignProjectRecord } from "@/lib/editor/project-storage";
import { getMockupModelConfig } from "@/lib/mockup/mockup-models";

type MockupMode = "2d" | "3d";

type OverlayTransform = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
};

const fallbackDesign = "/reference/template_sosmed_set.jpg";

function makeFallbackProject(): DesignProjectRecord {
  return {
    id: "fallback-template",
    user_id: "local-user",
    product_id: null,
    name: "Template Demo MerchDesign",
    canvas_json: {},
    preview_url: fallbackDesign,
    width: 1080,
    height: 1080,
    unit: "px",
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function getProductMockupClass(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("mug") || name.includes("tumbler")) return "h-80 w-64 rounded-[4rem] border-[14px] border-white/55";
  if (name.includes("tote")) return "h-[25rem] w-72 rounded-[2rem] border-[10px] border-white/45";
  if (name.includes("packaging") || name.includes("paper bag")) return "h-80 w-80 rounded-[1.5rem] border-[10px] border-white/45";
  if (name.includes("keychain")) return "h-52 w-80 rounded-[2rem] border-[10px] border-white/45";
  if (name.includes("trophy") || name.includes("logo stand")) return "h-80 w-60 rounded-t-[5rem] rounded-b-2xl border-[10px] border-white/45";
  return "h-[26rem] w-80 rounded-t-[6rem] rounded-b-[2rem] border-[10px] border-white/45";
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function MockupStudio() {
  const export2DRef = useRef<HTMLDivElement | null>(null);
  const viewer3DRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<MockupMode>("2d");
  const [projects, setProjects] = useState<DesignProjectRecord[]>([]);
  const [projectId, setProjectId] = useState("fallback-template");
  const [productId, setProductId] = useState(products[0].id);
  const [productColor, setProductColor] = useState("#6c63ff");
  const [transform, setTransform] = useState<OverlayTransform>({ x: 0, y: 0, scale: 1, rotate: 0 });
  const [status, setStatus] = useState("Pilih project dan produk untuk membuat mockup.");

  useEffect(() => {
    queueMicrotask(() => {
      const stored = listDesignProjects();
      const active = loadDesignProject();
      const nextProjects = stored.length ? stored : [makeFallbackProject()];
      setProjects(nextProjects);
      setProjectId(active?.id ?? nextProjects[0].id);
    });
  }, []);

  const selectedProject = useMemo(() => projects.find((project) => project.id === projectId) ?? projects[0] ?? makeFallbackProject(), [projectId, projects]);
  const selectedProduct = useMemo(() => products.find((product) => product.id === productId) ?? products[0], [productId]);
  const modelConfig = useMemo(() => getMockupModelConfig(selectedProduct), [selectedProduct]);
  const designImage = selectedProject.preview_url || fallbackDesign;

  async function export2DPng() {
    if (!export2DRef.current) return;
    const dataUrl = await toPng(export2DRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#eef2f7"
    });
    downloadDataUrl(dataUrl, `${selectedProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedProduct.slug}-mockup.png`);
    setStatus("Mockup 2D berhasil diekspor sebagai PNG.");
  }

  function export3DScreenshot() {
    const canvas = viewer3DRef.current?.querySelector("canvas");
    if (!canvas) {
      setStatus("Canvas 3D belum siap. Putar mockup sebentar lalu coba lagi.");
      return;
    }
    downloadDataUrl(canvas.toDataURL("image/png"), `${selectedProduct.slug}-3d-screenshot.png`);
    setStatus("Screenshot 3D diekspor dari canvas viewer.");
  }

  function updateTransform(key: keyof OverlayTransform, value: number) {
    setTransform((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr_340px]">
      <Card className="space-y-5 p-5">
        <div>
          <p className="text-sm font-bold">Project & Product</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Data project dibaca dari `design_projects` localStorage fallback Phase 2.</p>
        </div>

        <label className="grid gap-2 text-xs font-semibold text-slate-500">
          Design Project
          <SelectNative value={selectedProject.id} onChange={(event) => setProjectId(event.target.value)}>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </SelectNative>
        </label>

        <label className="grid gap-2 text-xs font-semibold text-slate-500">
          Product Mockup
          <SelectNative value={productId} onChange={(event) => setProductId(event.target.value)}>
            {products
              .filter((item) => item.has2DMockup || item.has3DMockup)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </SelectNative>
        </label>

        <label className="grid gap-2 text-xs font-semibold text-slate-500">
          Product Color
          <Input type="color" value={productColor} onChange={(event) => setProductColor(event.target.value)} className="h-12 p-1" />
        </label>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button onClick={() => setMode("2d")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${mode === "2d" ? "brand-gradient text-white shadow-panel" : "text-slate-500"}`}>
            <ImageIcon className="h-4 w-4" />
            2D
          </button>
          <button onClick={() => setMode("3d")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${mode === "3d" ? "brand-gradient text-white shadow-panel" : "text-slate-500"}`}>
            <Layers3 className="h-4 w-4" />
            3D
          </button>
        </div>

        <div className="rounded-2xl bg-white/70 p-3 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Selected Design</p>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <Image src={designImage} alt={selectedProject.name} fill className="object-cover" sizes="260px" unoptimized={designImage.startsWith("data:")} />
          </div>
        </div>
      </Card>

      <Card className="min-h-[680px] overflow-hidden p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold">{mode === "2d" ? "2D Mockup Preview" : "3D Mockup Preview"}</p>
            <p className="text-sm text-slate-500">{selectedProduct.name} - {selectedProject.name}</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">{modelConfig.label}</div>
        </div>

        {mode === "2d" ? (
          <div ref={export2DRef} className="relative grid min-h-[600px] place-items-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,rgb(108_99_255_/_0.16),transparent_28rem),linear-gradient(135deg,#f8fafc,#eef2f7)] p-8">
            <div className="absolute left-6 top-6 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">2D Product Mockup</div>
            <div className="relative grid place-items-center">
              <div className={`${getProductMockupClass(selectedProduct.name)} shadow-[0_35px_90px_rgb(26_26_46_/_0.18)]`} style={{ background: productColor }} />
              {selectedProduct.name.toLowerCase().includes("tote") ? <div className="absolute -top-14 h-28 w-44 rounded-t-full border-[14px] border-b-0 border-current text-[color:var(--mockup-color)]" style={{ color: productColor }} /> : null}
              <div
                className="absolute grid place-items-center rounded-xl bg-white/88 p-2 shadow-panel"
                style={{
                  transform: `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotate}deg) scale(${transform.scale})`,
                  width: 220,
                  height: 180
                }}
              >
                <Image src={designImage} alt="Design overlay" fill className="rounded-xl object-contain p-2" sizes="220px" unoptimized={designImage.startsWith("data:")} />
              </div>
            </div>
          </div>
        ) : (
          <div ref={viewer3DRef} className="h-[620px] overflow-hidden rounded-[2rem] border bg-slate-50">
            <MockupViewer3D config={modelConfig} productColor={productColor} designImage={designImage} transform={{ x: transform.x / 220, y: -transform.y / 260, scale: transform.scale, rotate: transform.rotate }} />
          </div>
        )}
      </Card>

      <Card className="space-y-5 p-5">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[#6c63ff]" />
            <p className="font-bold">Mockup Controls</p>
          </div>
          <p className="text-xs leading-5 text-slate-500">Atur posisi, skala, dan rotasi desain di produk.</p>
        </div>

        <div className="space-y-4">
          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Position X: {transform.x}px
            <input type="range" min={-180} max={180} value={transform.x} onChange={(event) => updateTransform("x", Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Position Y: {transform.y}px
            <input type="range" min={-180} max={180} value={transform.y} onChange={(event) => updateTransform("y", Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Scale: {transform.scale.toFixed(2)}x
            <input type="range" min={0.35} max={1.8} step={0.05} value={transform.scale} onChange={(event) => updateTransform("scale", Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Rotate: {transform.rotate} deg
            <input type="range" min={-180} max={180} value={transform.rotate} onChange={(event) => updateTransform("rotate", Number(event.target.value))} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setTransform({ x: 0, y: 0, scale: 1, rotate: 0 })}>
            <RotateCw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={() => setTransform((current) => ({ ...current, scale: Math.min(current.scale + 0.1, 1.8) }))}>
            <Move className="h-4 w-4" />
            Zoom
          </Button>
        </div>

        {mode === "2d" ? (
          <Button className="w-full" onClick={export2DPng}>
            <Download className="h-4 w-4" />
            Export Mockup PNG
          </Button>
        ) : (
          <Button className="w-full" onClick={export3DScreenshot}>
            <Camera className="h-4 w-4" />
            Export 3D Screenshot
          </Button>
        )}

        <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          Struktur 3D memakai `MockupModelConfig`. Nanti setiap placeholder bisa diganti `glbUrl` dan loader GLB tanpa mengubah kontrol mockup.
        </div>

        <div className="rounded-2xl bg-white/70 p-4 text-xs leading-5 text-slate-500 shadow-sm">
          <p className="mb-1 font-bold text-slate-700">Status</p>
          {status}
        </div>

        <div className="rounded-2xl bg-[#1a1a2e] p-4 text-sm text-white">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <Box className="h-4 w-4" />
            GLB-ready
          </div>
          <p className="text-white/70">T-shirt, mug, tote bag, packaging box, keychain, dan trophy punya mapping placeholder desain.</p>
        </div>
      </Card>
    </div>
  );
}
