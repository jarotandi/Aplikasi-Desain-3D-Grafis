"use client";

import { useStudioStore } from "@/lib/store/studioStore";

function SliderField({
  label,
  value,
  max,
  onChange
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs text-slate-400">
      <span className="flex justify-between">
        <span>{label}</span>
        <span>{value.toFixed(2)}</span>
      </span>
      <input type="range" min={0} max={max} step={0.05} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full accent-cyan-400" />
    </label>
  );
}

export function LightingPanel() {
  const viewportSettings = useStudioStore((state) => state.viewportSettings);
  const updateViewportSettings = useStudioStore((state) => state.updateViewportSettings);

  return (
    <div className="space-y-3 rounded-md border border-white/10 bg-slate-900/50 p-3">
      <SliderField label="Ambient" value={viewportSettings.ambientIntensity} max={2} onChange={(ambientIntensity) => updateViewportSettings({ ambientIntensity })} />
      <SliderField label="Directional" value={viewportSettings.directionalIntensity} max={3} onChange={(directionalIntensity) => updateViewportSettings({ directionalIntensity })} />
      <label className="block text-xs text-slate-400">
        Background
        <input
          type="color"
          value={viewportSettings.background}
          onChange={(event) => updateViewportSettings({ background: event.target.value })}
          className="mt-1 h-9 w-full cursor-pointer rounded-md border border-white/10 bg-slate-950"
        />
      </label>
      <button
        type="button"
        onClick={() => updateViewportSettings({ ambientIntensity: 0.9, directionalIntensity: 1.8, background: "#111827" })}
        className="w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
      >
        Studio preset
      </button>
      <button
        type="button"
        onClick={() => updateViewportSettings({ ambientIntensity: 0.55, directionalIntensity: 2.3, background: "#020617" })}
        className="w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
      >
        Product render preset
      </button>
    </div>
  );
}
