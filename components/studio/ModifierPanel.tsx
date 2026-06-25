"use client";

import { Check, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import type { ModifierType } from "@/lib/types/studio";
import { useStudioStore } from "@/lib/store/studioStore";

const modifierOptions: Array<{ type: ModifierType; label: string }> = [
  { type: "boolean", label: "Boolean" },
  { type: "bevel", label: "Bevel" },
  { type: "mirror", label: "Mirror" },
  { type: "subdivision", label: "Subdivision" }
];

export function ModifierPanel() {
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const object = useStudioStore((state) => state.objects.find((item) => item.id === selectedObjectId));
  const addModifier = useStudioStore((state) => state.addModifier);
  const toggleModifier = useStudioStore((state) => state.toggleModifier);
  const applyModifier = useStudioStore((state) => state.applyModifier);
  const deleteModifier = useStudioStore((state) => state.deleteModifier);

  if (!object) {
    return <div className="rounded-md border border-white/10 bg-slate-900/50 p-3 text-xs text-slate-500">Select an object to manage modifiers.</div>;
  }

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-slate-900/50 p-3">
      <div className="grid grid-cols-2 gap-2">
        {modifierOptions.map((option) => (
          <button key={option.type} type="button" onClick={() => addModifier(object.id, option.type)} className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-slate-950 px-2 py-2 text-xs text-slate-200 hover:bg-white/10">
            <Plus className="h-3.5 w-3.5" /> {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {object.modifiers.length === 0 ? <div className="text-xs text-slate-500">No modifiers yet.</div> : null}
        {object.modifiers.map((modifier) => (
          <div key={modifier.id} className="rounded-md border border-white/10 bg-slate-950 p-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-medium text-slate-200">{modifier.name}</div>
                <div className="text-[11px] text-slate-500">{modifier.applied ? "Applied placeholder" : "Pending backend geometry"}</div>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => toggleModifier(object.id, modifier.id)} className="rounded p-1 text-slate-300 hover:bg-white/10">
                  {modifier.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button type="button" onClick={() => applyModifier(object.id, modifier.id)} className="rounded p-1 text-emerald-300 hover:bg-emerald-500/10">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => deleteModifier(object.id, modifier.id)} className="rounded p-1 text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
