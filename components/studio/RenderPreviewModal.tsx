"use client";

import { X } from "lucide-react";
import Image from "next/image";

export function RenderPreviewModal({ previewUrl, onClose }: { previewUrl?: string; onClose: () => void }) {
  if (!previewUrl) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">Render Preview</div>
            <div className="text-xs text-slate-500">Canvas capture PNG</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="bg-slate-900 p-4">
          <div className="relative h-[70vh] w-full">
            <Image src={previewUrl} alt="Render preview" fill unoptimized className="rounded-md object-contain" />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-white/10 px-4 py-3">
          <a href={previewUrl} download="render-preview.png" className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            Download PNG
          </a>
        </div>
      </div>
    </div>
  );
}
