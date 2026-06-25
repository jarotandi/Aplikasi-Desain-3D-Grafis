"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ClipboardList, Download, Eye, FilePlus2, FolderOpen, Import, Redo2, Save, Share2, Sparkles, Undo2 } from "lucide-react";
import { createImportedModelObject } from "@/lib/three/importGLB";
import { useStudioStore } from "@/lib/store/studioStore";
import { RequestQuotationModal } from "@/components/studio/RequestQuotationModal";

const iconButton = "inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-slate-900 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10";

export function TopToolbar() {
  const [quotationOpen, setQuotationOpen] = useState(false);
  const resetProject = useStudioStore((state) => state.resetProject);
  const saveProject = useStudioStore((state) => state.saveProject);
  const loadProject = useStudioStore((state) => state.loadProject);
  const undo = useStudioStore((state) => state.undo);
  const redo = useStudioStore((state) => state.redo);
  const importModel = useStudioStore((state) => state.importModel);
  const requestRender = useStudioStore((state) => state.requestRender);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950 px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-slate-900 text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white" title="Back to website">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="grid h-8 w-8 place-items-center rounded-md bg-cyan-400 text-sm font-black text-slate-950">3D</div>
        <div>
          <div className="text-sm font-semibold text-white">3D Product Studio</div>
          <div className="text-[11px] text-slate-500">Browser 3D editor MVP</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className={iconButton} onClick={resetProject}>
          <FilePlus2 className="h-4 w-4" /> New
        </button>
        <button type="button" className={iconButton} onClick={saveProject}>
          <Save className="h-4 w-4" /> Save
        </button>
        <button type="button" className={iconButton} onClick={loadProject}>
          <FolderOpen className="h-4 w-4" /> Open
        </button>
        <button type="button" className={iconButton} onClick={undo}>
          <Undo2 className="h-4 w-4" /> Undo
        </button>
        <button type="button" className={iconButton} onClick={redo}>
          <Redo2 className="h-4 w-4" /> Redo
        </button>
        <label className={iconButton}>
          <Import className="h-4 w-4" /> Import GLB
          <input
            type="file"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                importModel(await createImportedModelObject(file));
              } catch (error) {
                window.alert(error instanceof Error ? error.message : "Invalid model file.");
              } finally {
                event.target.value = "";
              }
            }}
          />
        </label>
        <button type="button" className={iconButton} onClick={() => window.dispatchEvent(new Event("studio:export-glb"))}>
          <Download className="h-4 w-4" /> Export GLB
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-cyan-400 px-3 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
          onClick={() => {
            void requestRender();
            window.dispatchEvent(new Event("studio:capture-preview"));
          }}
        >
          <Sparkles className="h-4 w-4" /> Render
        </button>
        <button type="button" className={iconButton} onClick={() => window.dispatchEvent(new Event("studio:capture-preview"))}>
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-400 px-3 text-xs font-semibold text-slate-950 transition hover:bg-emerald-300" onClick={() => setQuotationOpen(true)}>
          <ClipboardList className="h-4 w-4" /> Request Quotation
        </button>
        <button type="button" className={iconButton}>
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
      <RequestQuotationModal open={quotationOpen} onClose={() => setQuotationOpen(false)} />
    </header>
  );
}
