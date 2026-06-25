"use client";

import { Box, Circle, Cone, Disc3, Donut, Square } from "lucide-react";
import type { ObjectType } from "@/lib/types/studio";
import { useStudioStore } from "@/lib/store/studioStore";
import { cn } from "@/lib/utils";

const objectButtons: Array<{ type: ObjectType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { type: "cube", label: "Cube", icon: Box },
  { type: "sphere", label: "Sphere", icon: Circle },
  { type: "cylinder", label: "Cylinder", icon: Disc3 },
  { type: "plane", label: "Plane", icon: Square },
  { type: "cone", label: "Cone", icon: Cone },
  { type: "torus", label: "Torus", icon: Donut }
];

export function AddObjectPanel({ compact = false }: { compact?: boolean }) {
  const addObject = useStudioStore((state) => state.addObject);

  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-3")}>
      {objectButtons.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => addObject(type)}
          className="flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-white/10 bg-slate-900/70 text-xs text-slate-200 transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
