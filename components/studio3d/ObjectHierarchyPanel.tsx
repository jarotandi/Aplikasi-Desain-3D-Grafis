"use client";

import { Copy, Eye, EyeOff, Folder, Group, Trash2, Ungroup } from "lucide-react";
import { useStudio3DStore } from "@/store/studio3dStore";
import { cn } from "@/lib/utils";

export function ObjectHierarchyPanel() {
  const objects = useStudio3DStore((state) => state.sceneObjects);
  const selectedObjectIds = useStudio3DStore((state) => state.selectedObjectIds);
  const selectObject = useStudio3DStore((state) => state.selectObject);
  const updateObject = useStudio3DStore((state) => state.updateObject);
  const duplicateObject = useStudio3DStore((state) => state.duplicateObject);
  const deleteObject = useStudio3DStore((state) => state.deleteObject);
  const groupObjects = useStudio3DStore((state) => state.groupObjects);
  const ungroupObjects = useStudio3DStore((state) => state.ungroupObjects);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Object Hierarchy</h2>
        <div className="flex gap-1">
          <button onClick={groupObjects} className="rounded p-1 text-zinc-400 hover:bg-white/10"><Group className="h-3.5 w-3.5" /></button>
          <button onClick={ungroupObjects} className="rounded p-1 text-zinc-400 hover:bg-white/10"><Ungroup className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {objects.map((object) => (
          <div key={object.id} className={cn("flex items-center gap-2 rounded-md border px-2 py-2 text-xs", selectedObjectIds.includes(object.id) ? "border-cyan-400/70 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-zinc-900 text-zinc-300", object.parentId ? "ml-4" : "")}>
            {object.type === "group" ? <Folder className="h-3.5 w-3.5 text-amber-300" /> : null}
            <button className="min-w-0 flex-1 text-left" onClick={(event) => selectObject(object.id, event.ctrlKey || event.metaKey || event.shiftKey)}>{object.name}</button>
            <button onClick={() => updateObject(object.id, { isVisible: !object.isVisible })} className="rounded p-1 hover:bg-white/10">{object.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button>
            <button onClick={() => duplicateObject(object.id)} className="rounded p-1 hover:bg-white/10"><Copy className="h-3.5 w-3.5" /></button>
            <button onClick={() => deleteObject(object.id)} className="rounded p-1 text-red-300 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </section>
  );
}
