"use client";

import { useEffect, useState } from "react";
import { LeftToolbar } from "@/components/layout/LeftToolbar";
import { RightPanel } from "@/components/layout/RightPanel";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopToolbar } from "@/components/layout/TopToolbar";
import { RenderPreviewModal } from "@/components/studio/RenderPreviewModal";
import { StudioViewport } from "@/components/studio/StudioViewport";

export default function StudioPage() {
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ url: string }>;
      setPreviewUrl(customEvent.detail.url);
    };

    window.addEventListener("studio:render-preview-ready", handler);
    return () => window.removeEventListener("studio:render-preview-ready", handler);
  }, []);

  return (
    <main className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-950 text-slate-100">
      <TopToolbar />
      <div className="flex min-h-0 flex-1">
        <LeftToolbar />
        <section className="min-w-0 flex-1">
          <StudioViewport />
        </section>
        <RightPanel />
      </div>
      <StatusBar />
      <RenderPreviewModal previewUrl={previewUrl} onClose={() => setPreviewUrl(undefined)} />
    </main>
  );
}
