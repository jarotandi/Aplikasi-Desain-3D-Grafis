"use client";

import { Bot, Camera, ImagePlus, LampDesk, MousePointer2, Move3D, Palette, Rotate3D, Scaling, Shirt, SquarePlus, Type } from "lucide-react";
import { AddObjectPanel } from "@/components/studio/AddObjectPanel";
import { ProductMockupPanel } from "@/components/studio/ProductMockupPanel";
import { useStudioStore } from "@/lib/store/studioStore";
import type { ToolType } from "@/lib/types/studio";
import { cn } from "@/lib/utils";

const tools: Array<{ id: ToolType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "move", label: "Move", icon: Move3D },
  { id: "rotate", label: "Rotate", icon: Rotate3D },
  { id: "scale", label: "Scale", icon: Scaling },
  { id: "add-object", label: "Add Object", icon: SquarePlus },
  { id: "add-text", label: "Add Text", icon: Type },
  { id: "add-image", label: "Add Image", icon: ImagePlus },
  { id: "material", label: "Material", icon: Palette },
  { id: "mockup", label: "Mockup", icon: Shirt },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "lighting", label: "Lighting", icon: LampDesk }
];

export function LeftToolbar() {
  const activeTool = useStudioStore((state) => state.activeTool);
  const setActiveTool = useStudioStore((state) => state.setActiveTool);
  const setTransformMode = useStudioStore((state) => state.setTransformMode);
  const addObject = useStudioStore((state) => state.addObject);

  const activate = (tool: ToolType) => {
    setActiveTool(tool);
    if (tool === "move") setTransformMode("translate");
    if (tool === "rotate") setTransformMode("rotate");
    if (tool === "scale") setTransformMode("scale");
    if (tool === "add-text") addObject("text");
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-slate-950 p-3">
      <div className="grid grid-cols-2 gap-2">
        {tools.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => activate(id)}
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 rounded-md border text-xs transition",
              activeTool === id ? "border-cyan-400/70 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-300 hover:border-white/20 hover:bg-white/5"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Primitives</div>
          <AddObjectPanel compact />
        </section>

        <section>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Mockup Products</div>
          <ProductMockupPanel />
        </section>

        <section>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Decal / Logo</div>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-white/15 bg-slate-900/70 px-3 py-3 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10">
            <ImagePlus className="h-4 w-4" />
            Upload PNG/JPG
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () =>
                  addObject("decal", {
                    name: file.name.replace(/\.(png|jpg|jpeg)$/i, ""),
                    decalImageUrl: String(reader.result),
                    transform: { position: [0, 1.2, -0.85], rotation: [0, 0, 0], scale: [1, 1, 1] },
                    material: { color: "#ffffff", roughness: 0.2, metalness: 0, opacity: 1 }
                  });
                reader.readAsDataURL(file);
                event.target.value = "";
              }}
            />
          </label>
        </section>
      </div>
    </aside>
  );
}
