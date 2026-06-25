"use client";

import { useState } from "react";
import { useStudio3DStore } from "@/store/studio3dStore";

export function MeasurementInput() {
  const measurement = useStudio3DStore((state) => state.measurement);
  const updateMeasurementFromInput = useStudio3DStore((state) => state.updateMeasurementFromInput);
  const createRectangleFromMeasurement = useStudio3DStore((state) => state.createRectangleFromMeasurement);
  const createBoxFromMeasurement = useStudio3DStore((state) => state.createBoxFromMeasurement);
  const pushPullSelected = useStudio3DStore((state) => state.pushPullSelected);
  const [value, setValue] = useState(measurement.rawInput ?? `${measurement.width}x${measurement.depth}x${measurement.height}`);

  return (
    <div className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-md border border-white/10 bg-zinc-950/90 px-3 py-2 text-xs text-zinc-300 shadow-xl backdrop-blur">
      <span>Rectangle / Push-Pull MVP</span>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") updateMeasurementFromInput(value);
        }}
        placeholder="2m x 3m x 300cm"
        className="h-8 w-40 rounded border border-white/10 bg-zinc-900 px-2 text-xs text-zinc-100 outline-none focus:border-cyan-400"
      />
      <span className="rounded bg-zinc-900 px-2 py-1">{measurement.width.toFixed(2)} x {measurement.depth.toFixed(2)} x {measurement.height.toFixed(2)}</span>
      <button onClick={() => { updateMeasurementFromInput(value); createRectangleFromMeasurement(); }} className="rounded border border-cyan-400/40 px-3 py-1 font-semibold text-cyan-100">Draw Rectangle</button>
      <button onClick={() => { updateMeasurementFromInput(value); pushPullSelected(); }} className="rounded bg-cyan-400 px-3 py-1 font-semibold text-zinc-950">Push/Pull</button>
      <button onClick={() => { updateMeasurementFromInput(value); createBoxFromMeasurement(); }} className="rounded bg-emerald-400 px-3 py-1 font-semibold text-zinc-950">Create Box</button>
    </div>
  );
}
