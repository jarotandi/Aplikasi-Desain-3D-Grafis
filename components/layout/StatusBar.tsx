"use client";

import { useStudioStore } from "@/lib/store/studioStore";

export function StatusBar() {
  const objects = useStudioStore((state) => state.objects);
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const transformMode = useStudioStore((state) => state.transformMode);
  const selected = objects.find((object) => object.id === selectedObjectId);

  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-white/10 bg-slate-950 px-4 text-xs text-slate-500">
      <div>{objects.length} objects</div>
      <div>{selected ? `Selected: ${selected.name}` : "No selection"}</div>
      <div>Mode: {transformMode}</div>
    </footer>
  );
}
