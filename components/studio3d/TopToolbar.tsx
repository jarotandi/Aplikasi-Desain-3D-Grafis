"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Box, Download, FileJson, FolderOpen, Import, PackagePlus, Printer, Redo2, Save, Undo2 } from "lucide-react";
import { useStudio3DStore } from "@/store/studio3dStore";

const topButton = "inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-3 text-xs font-medium text-zinc-200 hover:border-cyan-400/50 hover:bg-cyan-400/10";

export function TopToolbar() {
  const saveProject = useStudio3DStore((state) => state.saveProject);
  const loadProject = useStudio3DStore((state) => state.loadProject);
  const undo = useStudio3DStore((state) => state.undo);
  const redo = useStudio3DStore((state) => state.redo);
  const importAsset = useStudio3DStore((state) => state.importAsset);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#15171d] px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="text-sm font-semibold text-white">Web-Based 3D Editing & Modeling Studio</div>
          <div className="text-[11px] text-zinc-500">SketchUp-like editor for design, mockup, printing, and quotation</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className={topButton}><span>File</span></button>
        <button className={topButton}><span>Edit</span></button>
        <button className={topButton}><span>View</span></button>
        <button className={topButton}><PackagePlus className="h-4 w-4" /> Insert</button>
        <button className={topButton}><Box className="h-4 w-4" /> Product Mockup</button>
        <button className={topButton}><Printer className="h-4 w-4" /> 3D Print</button>
        <button className={topButton}><Bot className="h-4 w-4" /> AI Assistant</button>
        <button className={topButton} onClick={loadProject}><FolderOpen className="h-4 w-4" /> Open</button>
        <label className={topButton}>
          <Import className="h-4 w-4" /> Import
          <input
            type="file"
            accept=".glb,.gltf,.obj,.stl"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void importAsset(file);
              event.target.value = "";
            }}
          />
        </label>
        <button className={topButton} onClick={saveProject}><Save className="h-4 w-4" /> Save</button>
        <button className={topButton} onClick={undo}><Undo2 className="h-4 w-4" /></button>
        <button className={topButton} onClick={redo}><Redo2 className="h-4 w-4" /></button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md bg-cyan-400 px-3 text-xs font-semibold text-zinc-950 hover:bg-cyan-300" onClick={() => window.dispatchEvent(new Event("studio3d:export-json"))}>
          <FileJson className="h-4 w-4" /> Export
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-400 px-3 text-xs font-semibold text-zinc-950 hover:bg-emerald-300" onClick={() => window.dispatchEvent(new Event("studio3d:create-quotation"))}>
          <Download className="h-4 w-4" /> Order
        </button>
      </div>
    </header>
  );
}
