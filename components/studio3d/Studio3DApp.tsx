"use client";

import { useEffect, useState } from "react";
import { BottomStatusBar } from "@/components/studio3d/BottomStatusBar";
import { Canvas3D } from "@/components/studio3d/Canvas3D";
import { LeftToolPanel } from "@/components/studio3d/LeftToolPanel";
import { MeasurementInput } from "@/components/studio3d/MeasurementInput";
import { RightPropertiesPanel } from "@/components/studio3d/RightPropertiesPanel";
import { TopToolbar } from "@/components/studio3d/TopToolbar";
import { ViewCube } from "@/components/studio3d/ViewCube";
import { useStudio3DStore } from "@/store/studio3dStore";

export function Studio3DApp() {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const createQuotation = useStudio3DStore((state) => state.createQuotation);

  useEffect(() => {
    const pngHandler = (event: Event) => setPreviewUrl((event as CustomEvent<{ url: string }>).detail.url);
    const quotationHandler = () => createQuotation(24);
    window.addEventListener("studio3d:png-ready", pngHandler);
    window.addEventListener("studio3d:create-quotation", quotationHandler);
    return () => {
      window.removeEventListener("studio3d:png-ready", pngHandler);
      window.removeEventListener("studio3d:create-quotation", quotationHandler);
    };
  }, [createQuotation]);

  return (
    <main className="flex h-screen min-h-0 flex-col overflow-hidden bg-[#111318] text-zinc-100">
      <TopToolbar />
      <div className="flex min-h-0 flex-1">
        <LeftToolPanel />
        <section className="relative min-w-0 flex-1">
          <Canvas3D />
          <ViewCube />
          <MeasurementInput />
          <button className="absolute bottom-14 right-5 z-10 rounded-full bg-purple-400 px-4 py-3 text-xs font-semibold text-zinc-950 shadow-xl hover:bg-purple-300">AI Assistant</button>
        </section>
        <RightPropertiesPanel />
      </div>
      <BottomStatusBar />
      {previewUrl ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6">
          <div className="max-w-4xl rounded-lg border border-white/10 bg-zinc-950 p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">PNG Render Preview</span><button onClick={() => setPreviewUrl(undefined)} className="text-zinc-400">Close</button></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="3D render preview" className="max-h-[70vh] rounded-md object-contain" />
            <a href={previewUrl} download="studio-3d-render.png" className="mt-3 inline-block rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-zinc-950">Download PNG</a>
          </div>
        </div>
      ) : null}
    </main>
  );
}
