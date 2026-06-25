"use client";

import { Eye, EyeOff, Lock, Plus, Unlock } from "lucide-react";
import { useStudio3DStore } from "@/store/studio3dStore";

export function LayerPanel() {
  const layers = useStudio3DStore((state) => state.layers);
  const addLayer = useStudio3DStore((state) => state.addLayer);
  const updateLayer = useStudio3DStore((state) => state.updateLayer);

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Layers</h2>
        <button onClick={() => addLayer()} className="rounded p-1 text-zinc-400 hover:bg-white/10">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-2 rounded-md border border-white/10 bg-zinc-900/60 p-3">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center gap-2 rounded-md bg-zinc-950 px-2 py-2 text-xs text-zinc-300">
            <input value={layer.name} onChange={(event) => updateLayer(layer.id, { name: event.target.value })} className="min-w-0 flex-1 bg-transparent outline-none" />
            <button onClick={() => updateLayer(layer.id, { isVisible: !layer.isVisible })} className="rounded p-1 hover:bg-white/10">
              {layer.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => updateLayer(layer.id, { isLocked: !layer.isLocked })} className="rounded p-1 hover:bg-white/10">
              {layer.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
