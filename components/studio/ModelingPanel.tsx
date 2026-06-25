"use client";

import { AlignCenter, AlignEndHorizontal, AlignStartHorizontal, Boxes, Copy, Grid2X2, Scissors, Ungroup } from "lucide-react";
import { useStudioStore } from "@/lib/store/studioStore";

const buttonClass = "flex items-center justify-center gap-2 rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-xs text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-400/10";

export function ModelingPanel() {
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const selectedObjectIds = useStudioStore((state) => state.selectedObjectIds);
  const duplicateSelected = useStudioStore((state) => state.duplicateSelected);
  const groupSelected = useStudioStore((state) => state.groupSelected);
  const ungroupObject = useStudioStore((state) => state.ungroupObject);
  const snapSelectedToGrid = useStudioStore((state) => state.snapSelectedToGrid);
  const alignSelected = useStudioStore((state) => state.alignSelected);

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-slate-900/50 p-3">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={duplicateSelected} className={buttonClass}>
          <Copy className="h-3.5 w-3.5" /> Duplicate
        </button>
        <button type="button" onClick={groupSelected} className={buttonClass} disabled={selectedObjectIds.length < 2}>
          <Boxes className="h-3.5 w-3.5" /> Group
        </button>
        <button type="button" onClick={() => selectedObjectId && ungroupObject(selectedObjectId)} className={buttonClass}>
          <Ungroup className="h-3.5 w-3.5" /> Ungroup
        </button>
        <button type="button" onClick={() => snapSelectedToGrid(0.5)} className={buttonClass}>
          <Grid2X2 className="h-3.5 w-3.5" /> Snap 0.5
        </button>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Align X</div>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={() => alignSelected("x", "min")} className={buttonClass}>
            <AlignStartHorizontal className="h-3.5 w-3.5" /> Left
          </button>
          <button type="button" onClick={() => alignSelected("x", "center")} className={buttonClass}>
            <AlignCenter className="h-3.5 w-3.5" /> Center
          </button>
          <button type="button" onClick={() => alignSelected("x", "max")} className={buttonClass}>
            <AlignEndHorizontal className="h-3.5 w-3.5" /> Right
          </button>
        </div>
      </div>

      <div className="rounded-md border border-dashed border-white/10 p-3 text-xs text-slate-500">
        <div className="mb-1 flex items-center gap-2 text-slate-300">
          <Scissors className="h-3.5 w-3.5" /> Boolean operations
        </div>
        Placeholder only. Boolean geometry will be resolved by the Blender backend in a later stage.
      </div>
    </div>
  );
}
