"use client";

export function ViewCube() {
  const view = (name: string) => window.dispatchEvent(new Event(`studio3d:view-${name}`));

  return (
    <div className="absolute right-5 top-20 z-10 rounded-lg border border-white/10 bg-zinc-950/85 p-2 text-xs font-semibold text-zinc-300 shadow-xl backdrop-blur">
      <div className="grid grid-cols-3 gap-1">
        <button onClick={() => view("top")} className="col-start-2 rounded bg-zinc-900 px-2 py-1 hover:bg-cyan-400/20">Top</button>
        <button onClick={() => view("left")} className="rounded bg-zinc-900 px-2 py-1 hover:bg-cyan-400/20">Left</button>
        <button onClick={() => view("front")} className="rounded bg-cyan-400/20 px-2 py-1 text-cyan-100">Front</button>
        <button onClick={() => view("right")} className="rounded bg-zinc-900 px-2 py-1 hover:bg-cyan-400/20">Right</button>
        <button onClick={() => view("perspective")} className="col-span-3 rounded bg-zinc-900 px-2 py-1 hover:bg-cyan-400/20">Perspective</button>
      </div>
    </div>
  );
}
