"use client";

export function ExportPanel() {
  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Export & 3D Print</h2>
      <div className="grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-zinc-900/60 p-3">
        <button onClick={() => window.dispatchEvent(new Event("studio3d:export-png"))} className="rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">PNG</button>
        <button onClick={() => window.dispatchEvent(new Event("studio3d:export-glb"))} className="rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">GLB</button>
        <button onClick={() => window.dispatchEvent(new Event("studio3d:export-stl"))} className="rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">STL</button>
        <button onClick={() => window.dispatchEvent(new Event("studio3d:export-obj"))} className="rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">OBJ</button>
        <button onClick={() => window.dispatchEvent(new Event("studio3d:export-json"))} className="col-span-2 rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">Project JSON</button>
        <div className="col-span-2 rounded-md border border-dashed border-amber-400/25 bg-amber-400/5 p-3 text-xs text-amber-100/80">
          3D print checks: dimension, scale, print time, volume, and non-manifold validation are MVP placeholders.
        </div>
      </div>
    </section>
  );
}
