"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  ArrowDownToLine,
  ArrowUpToLine,
  Box,
  Circle,
  Copy,
  Download,
  ImagePlus,
  Layers,
  RotateCcw,
  Save,
  Square,
  Trash2,
  Type,
} from "lucide-react";
import * as fabric from "fabric";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { saveDesignProject, loadDesignProject, type DesignProjectRecord } from "@/lib/editor/project-storage";

type ActiveProps = {
  id?: string;
  type?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  fill?: string;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  text?: string;
};

const ARTBOARD = {
  width: 720,
  height: 920,
  print: { left: 90, top: 130, width: 540, height: 660 },
  safeInset: 34,
  bleedInset: 18
};

const fonts = ["Inter", "Arial", "Georgia", "Times New Roman", "Courier New"];

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `obj-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

function getObjectId(object: fabric.FabricObject) {
  return (object as fabric.FabricObject & { id?: string }).id;
}

function setObjectId(object: fabric.FabricObject, id = createId()) {
  (object as fabric.FabricObject & { id?: string }).id = id;
}

export function DesignEditor() {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [projectId, setProjectId] = useState("local-project-1");
  const [projectName, setProjectName] = useState("Merchandise Campaign Design");
  const [selectedProps, setSelectedProps] = useState<ActiveProps | null>(null);
  const [zoom, setZoom] = useState(0.78);
  const [status, setStatus] = useState("LocalStorage fallback aktif");
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [showPrintArea, setShowPrintArea] = useState(true);

  const scaleStyle = useMemo(() => ({ transform: `scale(${zoom})`, transformOrigin: "center top" }), [zoom]);

  useEffect(() => {
    if (!canvasElementRef.current || fabricCanvasRef.current) return;

    const canvas = new fabric.Canvas(canvasElementRef.current, {
      width: ARTBOARD.width,
      height: ARTBOARD.height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selectionColor: "rgba(108, 99, 255, 0.12)",
      selectionBorderColor: "#6c63ff",
      selectionLineWidth: 2
    });

    fabricCanvasRef.current = canvas;
    seedInitialCanvas(canvas);

    const syncSelection = () => {
      const active = canvas.getActiveObject();
      if (!active || getObjectId(active)?.startsWith("guide-")) {
        setSelectedProps(null);
        return;
      }

      const textObject = active as fabric.Textbox;
      setSelectedProps({
        id: getObjectId(active),
        type: active.type,
        left: Math.round(active.left ?? 0),
        top: Math.round(active.top ?? 0),
        width: Math.round(active.getScaledWidth()),
        height: Math.round(active.getScaledHeight()),
        angle: Math.round(active.angle ?? 0),
        fill: typeof active.fill === "string" ? active.fill : "#6c63ff",
        opacity: Number(active.opacity ?? 1),
        fontSize: textObject.fontSize,
        fontFamily: textObject.fontFamily,
        text: textObject.text
      });
    };
    canvas.on("selection:created", syncSelection);
    canvas.on("selection:updated", syncSelection);
    canvas.on("selection:cleared", () => setSelectedProps(null));
    canvas.on("object:modified", syncSelection);
    canvas.on("object:moving", syncSelection);
    canvas.on("object:scaling", syncSelection);
    canvas.on("object:rotating", syncSelection);

    const saved = loadDesignProject();
    if (saved) {
      setProjectId(saved.id);
      setProjectName(saved.name);
      canvas.loadFromJSON(saved.canvas_json as Record<string, unknown>).then(() => {
        canvas.getObjects().forEach((object) => {
          if (!getObjectId(object)) setObjectId(object);
        });
        addGuideObjects(canvas);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        setSelectedProps(null);
        setStatus(`Project ${saved.name} dimuat dari design_projects fallback.`);
      });
    }

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
    // The Fabric canvas is intentionally initialized once. Runtime guideline
    // toggles are handled by the separate visibility effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const ids = { "guide-bleed": showSafeZone, "guide-safe": showSafeZone, "guide-print": showPrintArea };
    canvas.getObjects().forEach((object) => {
      const id = getObjectId(object);
      if (id && id in ids) object.set("visible", ids[id as keyof typeof ids]);
    });
    canvas.requestRenderAll();
  }, [showSafeZone, showPrintArea]);

  function seedInitialCanvas(canvas: fabric.Canvas) {
    const title = new fabric.Textbox("YOUR BRAND", {
      left: 170,
      top: 252,
      width: 380,
      fontFamily: "Inter",
      fontSize: 56,
      fontWeight: "bold",
      fill: "#1a1a2e",
      textAlign: "center"
    });
    setObjectId(title, "seed-title");

    const subtitle = new fabric.Textbox("Custom merch ready", {
      left: 226,
      top: 330,
      width: 270,
      fontFamily: "Inter",
      fontSize: 22,
      fill: "#6b7280",
      textAlign: "center"
    });
    setObjectId(subtitle, "seed-subtitle");

    const accent = new fabric.Rect({
      left: 236,
      top: 402,
      width: 250,
      height: 74,
      rx: 24,
      ry: 24,
      fill: "#00d4aa",
      opacity: 0.9
    });
    setObjectId(accent, "seed-accent");

    canvas.add(accent, title, subtitle);
    canvas.requestRenderAll();
  }

  function addGuideObjects(canvas: fabric.Canvas) {
    removeGuideObjects(canvas);

    const bleed = new fabric.Rect({
      left: ARTBOARD.bleedInset,
      top: ARTBOARD.bleedInset,
      width: ARTBOARD.width - ARTBOARD.bleedInset * 2,
      height: ARTBOARD.height - ARTBOARD.bleedInset * 2,
      fill: "transparent",
      stroke: "#ff6584",
      strokeDashArray: [10, 8],
      strokeWidth: 2,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      visible: showSafeZone
    });
    setObjectId(bleed, "guide-bleed");

    const print = new fabric.Rect({
      left: ARTBOARD.print.left,
      top: ARTBOARD.print.top,
      width: ARTBOARD.print.width,
      height: ARTBOARD.print.height,
      fill: "rgba(0, 212, 170, 0.04)",
      stroke: "#00d4aa",
      strokeDashArray: [12, 8],
      strokeWidth: 2,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      visible: showPrintArea
    });
    setObjectId(print, "guide-print");

    const safe = new fabric.Rect({
      left: ARTBOARD.print.left + ARTBOARD.safeInset,
      top: ARTBOARD.print.top + ARTBOARD.safeInset,
      width: ARTBOARD.print.width - ARTBOARD.safeInset * 2,
      height: ARTBOARD.print.height - ARTBOARD.safeInset * 2,
      fill: "transparent",
      stroke: "#6c63ff",
      strokeDashArray: [6, 7],
      strokeWidth: 1.5,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      visible: showSafeZone
    });
    setObjectId(safe, "guide-safe");

    canvas.add(bleed, print, safe);
    canvas.sendObjectToBack(bleed);
    canvas.sendObjectToBack(print);
    canvas.sendObjectToBack(safe);
  }

  function removeGuideObjects(canvas: fabric.Canvas) {
    canvas
      .getObjects()
      .filter((object) => getObjectId(object)?.startsWith("guide-"))
      .forEach((object) => canvas.remove(object));
  }

  function updateSelectedProps(canvas = fabricCanvasRef.current) {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || getObjectId(active)?.startsWith("guide-")) {
      setSelectedProps(null);
      return;
    }

    const scaledWidth = Math.round(active.getScaledWidth());
    const scaledHeight = Math.round(active.getScaledHeight());
    const textObject = active as fabric.Textbox;
    setSelectedProps({
      id: getObjectId(active),
      type: active.type,
      left: Math.round(active.left ?? 0),
      top: Math.round(active.top ?? 0),
      width: scaledWidth,
      height: scaledHeight,
      angle: Math.round(active.angle ?? 0),
      fill: typeof active.fill === "string" ? active.fill : "#6c63ff",
      opacity: Number(active.opacity ?? 1),
      fontSize: textObject.fontSize,
      fontFamily: textObject.fontFamily,
      text: textObject.text
    });
  }

  function addObject(object: fabric.FabricObject) {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    setObjectId(object);
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
    updateSelectedProps(canvas);
  }

  function addText() {
    addObject(
      new fabric.Textbox("Tulis teks", {
        left: 190,
        top: 180,
        width: 330,
        fontFamily: "Inter",
        fontSize: 42,
        fontWeight: 700,
        fill: "#1a1a2e",
        textAlign: "center"
      })
    );
  }

  function addRect() {
    addObject(
      new fabric.Rect({
        left: 230,
        top: 300,
        width: 250,
        height: 140,
        rx: 24,
        ry: 24,
        fill: "#6c63ff"
      })
    );
  }

  function addCircle() {
    addObject(
      new fabric.Circle({
        left: 260,
        top: 320,
        radius: 90,
        fill: "#ff6584"
      })
    );
  }

  function addLine() {
    addObject(
      new fabric.Line([0, 0, 260, 0], {
        left: 230,
        top: 450,
        stroke: "#00d4aa",
        strokeWidth: 10,
        strokeLineCap: "round"
      })
    );
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const url = String(reader.result);
      const image = await fabric.FabricImage.fromURL(url);
      image.set({ left: 180, top: 220, cornerStyle: "circle" });
      image.scaleToWidth(360);
      addObject(image);
      setStatus(`Asset ${file.name} ditambahkan ke canvas`);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function deleteObject() {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;
    canvas.remove(active);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedProps(null);
  }

  async function duplicateObject() {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;
    const clone = await active.clone();
    clone.set({
      left: (active.left ?? 0) + 28,
      top: (active.top ?? 0) + 28
    });
    setObjectId(clone);
    canvas.add(clone);
    canvas.setActiveObject(clone);
    canvas.requestRenderAll();
    updateSelectedProps(canvas);
  }

  function moveLayer(direction: "front" | "forward" | "backward" | "back") {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;
    if (direction === "front") canvas.bringObjectToFront(active);
    if (direction === "forward") canvas.bringObjectForward(active);
    if (direction === "backward") canvas.sendObjectBackwards(active);
    if (direction === "back") canvas.sendObjectToBack(active);
    addGuideObjects(canvas);
    canvas.setActiveObject(active);
    canvas.requestRenderAll();
  }

  function updateActive<K extends keyof fabric.FabricObject>(key: K, value: fabric.FabricObject[K]) {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;
    active.set(key, value);
    active.setCoords();
    canvas.requestRenderAll();
    updateSelectedProps(canvas);
  }

  function updateText(value: string) {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active || !("text" in active)) return;
    (active as fabric.Textbox).set("text", value);
    canvas.requestRenderAll();
    updateSelectedProps(canvas);
  }

  function saveCanvasJson() {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    removeGuideObjects(canvas);
    const canvasJson = canvas.toObject(["id"]);
    const previewUrl = canvas.toDataURL({ format: "png", quality: 1, multiplier: 1 });
    addGuideObjects(canvas);
    const record = saveDesignProject({
      id: projectId,
      user_id: "local-user",
      product_id: null,
      name: projectName,
      canvas_json: canvasJson,
      preview_url: previewUrl,
      width: ARTBOARD.width,
      height: ARTBOARD.height,
      unit: "px",
      status: "draft"
    });
    setProjectId(record.id);
    setStatus(`Project tersimpan ke design_projects fallback: ${new Date(record.updated_at).toLocaleTimeString("id-ID")}`);
  }

  async function loadCanvasJson() {
    const canvas = fabricCanvasRef.current;
    const saved = loadDesignProject(projectId);
    if (!canvas || !saved) {
      setStatus("Belum ada design_projects tersimpan di localStorage.");
      return;
    }
    await restoreProject(saved, canvas);
  }

  async function restoreProject(project: DesignProjectRecord, canvas: fabric.Canvas) {
    setProjectId(project.id);
    setProjectName(project.name);
    await canvas.loadFromJSON(project.canvas_json as Record<string, unknown>);
    canvas.getObjects().forEach((object) => {
      if (!getObjectId(object)) setObjectId(object);
    });
    addGuideObjects(canvas);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setSelectedProps(null);
    setStatus(`Project ${project.name} dimuat dari design_projects fallback.`);
  }

  function exportPng() {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    removeGuideObjects(canvas);
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
    addGuideObjects(canvas);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "merchdesign"}.png`;
    link.click();
    setStatus("PNG diekspor tanpa guideline.");
  }

  function centerObject() {
    const canvas = fabricCanvasRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active) return;
    canvas.centerObject(active);
    active.setCoords();
    canvas.requestRenderAll();
    updateSelectedProps(canvas);
  }

  return (
    <div className="min-h-screen bg-[#eef2f7] text-[#1a1a2e]">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/70 bg-white/78 px-4 py-3 shadow-sm backdrop-blur-2xl">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/dashboard" className="brand-gradient grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black text-white shadow-panel">
            M
          </Link>
          <div className="min-w-0">
            <Input value={projectName} onChange={(event) => setProjectName(event.target.value)} className="h-10 w-72 max-w-[58vw] border-white bg-white/90 font-semibold" />
            <p className="mt-1 truncate text-xs text-slate-500">{status}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={saveCanvasJson}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={loadCanvasJson}>
            <RotateCcw className="h-4 w-4" />
            Load
          </Button>
          <Button variant="outline" asChild>
            <Link href="/mockup-studio">
              <Box className="h-4 w-4" />
              Mockup
            </Link>
          </Button>
          <Button onClick={exportPng}>
            <Download className="h-4 w-4" />
            Export PNG
          </Button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-74px)] grid-cols-1 lg:grid-cols-[292px_1fr_360px]">
        <aside className="border-r border-white/70 bg-white/74 p-4 backdrop-blur-2xl">
          <div className="mb-4">
            <p className="text-sm font-bold">Asset Panel</p>
            <p className="text-xs text-slate-500">Tambah elemen seperti Canva/Figma sederhana.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={addText} className="h-20 flex-col">
              <Type className="h-5 w-5" />
              Text
            </Button>
            <Button variant="outline" onClick={addRect} className="h-20 flex-col">
              <Square className="h-5 w-5" />
              Rectangle
            </Button>
            <Button variant="outline" onClick={addCircle} className="h-20 flex-col">
              <Circle className="h-5 w-5" />
              Circle
            </Button>
            <Button variant="outline" onClick={addLine} className="h-20 flex-col">
              <AlignCenter className="h-5 w-5" />
              Line
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-3 w-full">
            <ImagePlus className="h-4 w-4" />
            Upload Image
          </Button>

          <Card className="mt-5 p-4">
            <p className="mb-3 text-sm font-bold">Template Cepat</p>
            <div className="grid gap-2">
              {["Event Shirt", "Coffee Label", "3D Keychain", "Corporate Gift"].map((item) => (
                <button key={item} className="rounded-2xl bg-slate-50 px-3 py-3 text-left text-sm font-semibold transition hover:bg-white hover:shadow-panel">
                  {item}
                </button>
              ))}
            </div>
          </Card>

          <Card className="mt-5 p-4">
            <p className="mb-3 text-sm font-bold">Guideline</p>
            <label className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
              Safe zone
              <input type="checkbox" checked={showSafeZone} onChange={(event) => setShowSafeZone(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
              Print area
              <input type="checkbox" checked={showPrintArea} onChange={(event) => setShowPrintArea(event.target.checked)} />
            </label>
            <p className="mt-3 text-xs leading-5 text-slate-500">Area pink adalah bleed, garis ungu adalah safe zone, garis tosca adalah printable area produk.</p>
          </Card>
        </aside>

        <section className="overflow-auto bg-[radial-gradient(circle_at_top,rgb(108_99_255_/_0.12),transparent_34rem)] p-6">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {[0.55, 0.78, 1].map((item) => (
              <button key={item} onClick={() => setZoom(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${zoom === item ? "brand-gradient text-white" : "bg-white text-slate-500"}`}>
                {Math.round(item * 100)}%
              </button>
            ))}
          </div>
          <div className="mx-auto flex min-h-[980px] w-max items-start justify-center">
            <div className="rounded-[2rem] bg-white/50 p-5 shadow-soft backdrop-blur" style={scaleStyle}>
              <canvas ref={canvasElementRef} className="rounded-2xl shadow-[0_30px_80px_rgb(26_26_46_/_0.16)]" />
            </div>
          </div>
        </section>

        <aside className="space-y-4 border-l border-white/70 bg-white/76 p-4 backdrop-blur-2xl">
          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-bold">Properties</p>
                <p className="text-xs text-slate-500">{selectedProps ? `${selectedProps.type} selected` : "Pilih objek di canvas"}</p>
              </div>
              <Layers className="h-5 w-5 text-[#6c63ff]" />
            </div>

            {selectedProps ? (
              <div className="space-y-4">
                {selectedProps.type === "textbox" ? (
                  <label className="grid gap-1 text-xs font-semibold text-slate-500">
                    Text
                    <Input value={selectedProps.text ?? ""} onChange={(event) => updateText(event.target.value)} />
                  </label>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1 text-xs font-semibold text-slate-500">
                    X
                    <Input type="number" value={selectedProps.left} onChange={(event) => updateActive("left", Number(event.target.value))} />
                  </label>
                  <label className="grid gap-1 text-xs font-semibold text-slate-500">
                    Y
                    <Input type="number" value={selectedProps.top} onChange={(event) => updateActive("top", Number(event.target.value))} />
                  </label>
                  <label className="grid gap-1 text-xs font-semibold text-slate-500">
                    Rotate
                    <Input type="number" value={selectedProps.angle} onChange={(event) => updateActive("angle", Number(event.target.value))} />
                  </label>
                  <label className="grid gap-1 text-xs font-semibold text-slate-500">
                    Opacity
                    <Input type="number" min={0} max={1} step={0.1} value={selectedProps.opacity} onChange={(event) => updateActive("opacity", Number(event.target.value))} />
                  </label>
                </div>

                {selectedProps.type !== "image" ? (
                  <label className="grid gap-1 text-xs font-semibold text-slate-500">
                    Fill / Stroke
                    <Input type="color" value={selectedProps.fill ?? "#6c63ff"} onChange={(event) => updateActive(selectedProps.type === "line" ? "stroke" : "fill", event.target.value)} />
                  </label>
                ) : null}

                {selectedProps.type === "textbox" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-xs font-semibold text-slate-500">
                      Font size
                      <Input type="number" value={selectedProps.fontSize ?? 42} onChange={(event) => updateActive("fontSize" as keyof fabric.FabricObject, Number(event.target.value) as never)} />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-500">
                      Font
                      <SelectNative value={selectedProps.fontFamily ?? "Inter"} onChange={(event) => updateActive("fontFamily" as keyof fabric.FabricObject, event.target.value as never)}>
                        {fonts.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </SelectNative>
                    </label>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={duplicateObject}>
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </Button>
                  <Button variant="outline" onClick={centerObject}>
                    <AlignCenter className="h-4 w-4" />
                    Center
                  </Button>
                  <Button variant="outline" onClick={() => moveLayer("front")}>
                    <ArrowUpToLine className="h-4 w-4" />
                    Front
                  </Button>
                  <Button variant="outline" onClick={() => moveLayer("back")}>
                    <ArrowDownToLine className="h-4 w-4" />
                    Back
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => moveLayer("forward")}>Layer Up</Button>
                  <Button variant="outline" onClick={() => moveLayer("backward")}>Layer Down</Button>
                </div>

                <Button variant="outline" onClick={deleteObject} className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  Delete Object
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">Klik teks, shape, atau gambar untuk mengatur posisi, warna, rotasi, opacity, dan layer order.</div>
            )}
          </Card>

          <Card className="p-4">
            <p className="mb-2 font-bold">design_projects</p>
            <div className="space-y-2 text-sm text-slate-500">
              <p>ID: {projectId}</p>
              <p>Size: {ARTBOARD.width} x {ARTBOARD.height}px</p>
              <p>Status: draft</p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
