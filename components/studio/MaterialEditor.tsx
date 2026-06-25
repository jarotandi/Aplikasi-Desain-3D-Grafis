"use client";

import type { StudioObject } from "@/lib/types/studio";
import { useStudioStore } from "@/lib/store/studioStore";

interface MaterialEditorProps {
  object: StudioObject;
}

export function MaterialEditor({ object }: MaterialEditorProps) {
  const setMaterial = useStudioStore((state) => state.setMaterial);

  return (
    <div className="space-y-3">
      <label className="block text-xs text-slate-400">
        Color
        <input
          type="color"
          value={object.material.color}
          onChange={(event) => setMaterial(object.id, { color: event.target.value })}
          className="mt-1 h-9 w-full cursor-pointer rounded-md border border-white/10 bg-slate-900"
        />
      </label>
      {(["roughness", "metalness", "opacity"] as const).map((key) => (
        <label key={key} className="block text-xs text-slate-400">
          <span className="flex justify-between">
            <span className="capitalize">{key}</span>
            <span>{object.material[key].toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={object.material[key]}
            onChange={(event) => setMaterial(object.id, { [key]: Number(event.target.value) })}
            className="mt-1 w-full accent-cyan-400"
          />
        </label>
      ))}
      <label className="block text-xs text-slate-400">
        Texture placeholder
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setMaterial(object.id, { textureDataUrl: String(reader.result) });
            reader.readAsDataURL(file);
          }}
          className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-xs text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-cyan-400/20 file:px-2 file:py-1 file:text-cyan-100"
        />
      </label>
    </div>
  );
}
