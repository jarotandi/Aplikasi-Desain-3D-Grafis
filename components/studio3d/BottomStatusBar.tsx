"use client";

import { useStudio3DStore } from "@/store/studio3dStore";

export function BottomStatusBar() {
  const activeTool = useStudio3DStore((state) => state.activeTool);
  const unit = useStudio3DStore((state) => state.unit);
  const gridSize = useStudio3DStore((state) => state.gridSize);
  const snapEnabled = useStudio3DStore((state) => state.snapEnabled);
  const snapMode = useStudio3DStore((state) => state.snapMode);
  const setSnapMode = useStudio3DStore((state) => state.setSnapMode);
  const toggleSnap = useStudio3DStore((state) => state.toggleSnap);
  const sceneObjects = useStudio3DStore((state) => state.sceneObjects);
  const isDirty = useStudio3DStore((state) => state.isDirty);

  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-white/10 bg-[#15171d] px-4 text-xs text-zinc-500">
      <span>Tool: {activeTool}</span>
      <span>Unit: {unit}</span>
      <span>Grid: {gridSize}</span>
      <button onClick={toggleSnap}>Snap: {snapEnabled ? "on" : "off"}</button>
      <select value={snapMode} onChange={(event) => setSnapMode(event.target.value as typeof snapMode)} className="h-6 rounded border border-white/10 bg-zinc-900 px-2 text-xs text-zinc-300">
        <option value="grid">grid</option>
        <option value="vertex">vertex</option>
        <option value="edge">edge</option>
        <option value="midpoint">midpoint</option>
        <option value="face">face</option>
      </select>
      <span>Objects: {sceneObjects.length}</span>
      <span>{isDirty ? "Unsaved changes" : "Project saved"}</span>
    </footer>
  );
}
