"use client";

import { Copy, Eye, EyeOff, Folder, Lock, Trash2, Unlock } from "lucide-react";
import { useStudioStore } from "@/lib/store/studioStore";
import { cn } from "@/lib/utils";

export function SceneOutliner() {
  const objects = useStudioStore((state) => state.objects);
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const selectedObjectIds = useStudioStore((state) => state.selectedObjectIds);
  const selectObject = useStudioStore((state) => state.selectObject);
  const updateObject = useStudioStore((state) => state.updateObject);
  const duplicateObject = useStudioStore((state) => state.duplicateObject);
  const deleteObject = useStudioStore((state) => state.deleteObject);

  return (
    <div className="space-y-2">
      {objects.map((object) => (
        <div
          key={object.id}
          className={cn(
            "flex items-center gap-2 rounded-md border px-2 py-2 text-xs",
            selectedObjectIds.includes(object.id) || selectedObjectId === object.id ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-slate-900/60 text-slate-300",
            object.parentId ? "ml-4" : ""
          )}
        >
          {object.type === "group" ? <Folder className="h-3.5 w-3.5 text-amber-300" /> : null}
          <button type="button" className="min-w-0 flex-1 text-left" onClick={(event) => selectObject(object.id, event.ctrlKey || event.metaKey || event.shiftKey)}>
            <input
              value={object.name}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => updateObject(object.id, { name: event.target.value })}
              className="w-full bg-transparent outline-none"
            />
          </button>
          <button type="button" onClick={() => updateObject(object.id, { visible: !object.visible })} className="rounded p-1 hover:bg-white/10" title={object.visible ? "Hide" : "Show"}>
            {object.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={() => updateObject(object.id, { locked: !object.locked })} className="rounded p-1 hover:bg-white/10" title={object.locked ? "Unlock" : "Lock"}>
            {object.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={() => duplicateObject(object.id)} className="rounded p-1 hover:bg-white/10" title="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => deleteObject(object.id)} className="rounded p-1 text-red-300 hover:bg-red-500/10" title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
