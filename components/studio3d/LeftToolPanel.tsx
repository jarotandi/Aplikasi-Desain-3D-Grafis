"use client";

import { Box, Circle, Cone, Cuboid, DraftingCompass, Eraser, Frame, Hand, MousePointer2, Move3D, Paintbrush, PenLine, Rotate3D, Ruler, Scaling, Square, Type } from "lucide-react";
import { useEffect } from "react";
import type { GeometryType, StudioToolId } from "@/types/studio3d";
import { useStudio3DStore } from "@/store/studio3dStore";
import { cn } from "@/lib/utils";

const tools: Array<{ id: StudioToolId; label: string; icon: React.ComponentType<{ className?: string }>; shortcut?: string }> = [
  { id: "select", label: "Select", icon: MousePointer2, shortcut: "V" },
  { id: "move", label: "Move", icon: Move3D, shortcut: "M" },
  { id: "rotate", label: "Rotate", icon: Rotate3D, shortcut: "R" },
  { id: "scale", label: "Scale", icon: Scaling, shortcut: "S" },
  { id: "line", label: "Line", icon: PenLine, shortcut: "L" },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "pushPull", label: "Push/Pull", icon: Hand, shortcut: "P" },
  { id: "offset", label: "Offset", icon: Frame, shortcut: "O" },
  { id: "measure", label: "Measure", icon: Ruler, shortcut: "D" },
  { id: "paint", label: "Paint", icon: Paintbrush },
  { id: "text3d", label: "Text", icon: Type, shortcut: "T" }
];

const primitives: Array<{ type: GeometryType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { type: "cube", label: "Cube", icon: Box },
  { type: "box", label: "Box", icon: Cuboid },
  { type: "plane", label: "Plane", icon: Square },
  { type: "sphere", label: "Sphere", icon: Circle },
  { type: "cylinder", label: "Cylinder", icon: DraftingCompass },
  { type: "cone", label: "Cone", icon: Cone },
  { type: "torus", label: "Torus", icon: Circle },
  { type: "wall", label: "Wall", icon: Frame },
  { type: "floor", label: "Floor", icon: Square },
  { type: "door", label: "Door", icon: Frame },
  { type: "window", label: "Window", icon: Frame },
  { type: "table", label: "Table", icon: Cuboid },
  { type: "chair", label: "Chair", icon: Cuboid },
  { type: "rack", label: "Rack", icon: Frame },
  { type: "booth", label: "Booth", icon: Cuboid },
  { type: "backdrop", label: "Backdrop", icon: Frame },
  { type: "stage", label: "Stage", icon: Cuboid },
  { type: "banner-stand", label: "Banner", icon: Frame },
  { type: "product-display", label: "Display", icon: Cuboid },
  { type: "packaging-box", label: "Packaging", icon: Cuboid }
];

export function LeftToolPanel() {
  const activeTool = useStudio3DStore((state) => state.activeTool);
  const setActiveTool = useStudio3DStore((state) => state.setActiveTool);
  const setTransformMode = useStudio3DStore((state) => state.setTransformMode);
  const addObject = useStudio3DStore((state) => state.addObject);
  const selectedObjectIds = useStudio3DStore((state) => state.selectedObjectIds);
  const deleteObject = useStudio3DStore((state) => state.deleteObject);
  const undo = useStudio3DStore((state) => state.undo);
  const redo = useStudio3DStore((state) => state.redo);
  const saveProject = useStudio3DStore((state) => state.saveProject);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); undo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); saveProject(); }
      if (event.key === "Delete") selectedObjectIds.forEach(deleteObject);
      const tool = tools.find((item) => item.shortcut?.toLowerCase() === event.key.toLowerCase());
      if (tool) setActiveTool(tool.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteObject, redo, saveProject, selectedObjectIds, setActiveTool, undo]);

  const activate = (tool: StudioToolId) => {
    setActiveTool(tool);
    if (tool === "move") setTransformMode("translate");
    if (tool === "rotate") setTransformMode("rotate");
    if (tool === "scale") setTransformMode("scale");
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[#15171d] p-3">
      <div className="grid grid-cols-2 gap-2">
        {tools.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => activate(id)} className={cn("flex h-14 flex-col items-center justify-center gap-1 rounded-md border text-xs", activeTool === id ? "border-cyan-400 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/10")}>
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      <section className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Shape Creation</div>
        <div className="grid grid-cols-2 gap-2">
          {primitives.map(({ type, label, icon: Icon }) => (
            <button key={type} onClick={() => addObject(type)} className="flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-zinc-900 px-2 text-xs text-zinc-300 hover:border-cyan-400/50 hover:bg-cyan-400/10">
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </section>
      <section className="mt-5 rounded-md border border-dashed border-amber-400/25 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100/80">
        <div className="mb-1 flex items-center gap-2 font-semibold text-amber-200"><Eraser className="h-3.5 w-3.5" /> Advanced geometry</div>
        Snap vertex/edge/face, real boolean, chamfer, and mesh face editing are structured as backend-ready placeholders.
      </section>
    </aside>
  );
}
