"use client";

import { Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { useStudio3DStore } from "@/store/studio3dStore";
import type { Dimensions, Vector3Value } from "@/types/studio3d";
import { ObjectHierarchyPanel } from "@/components/studio3d/ObjectHierarchyPanel";
import { MaterialPanel } from "@/components/studio3d/MaterialPanel";
import { ProductMockupPanel } from "@/components/studio3d/ProductMockupPanel";
import { ExportPanel } from "@/components/studio3d/ExportPanel";
import { AI3DAssistantPanel } from "@/components/studio3d/AI3DAssistantPanel";
import { OrderQuotationPanel } from "@/components/studio3d/OrderQuotationPanel";
import { LayerPanel } from "@/components/studio3d/LayerPanel";

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-[11px] uppercase tracking-wide text-zinc-500">
      {label}
      <input type="number" step={0.1} value={Number(value.toFixed(3))} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 h-8 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200 outline-none focus:border-cyan-400" />
    </label>
  );
}

function VectorInputs({ title, value, onChange }: { title: string; value: Vector3Value; onChange: (value: Vector3Value) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-zinc-300">{title}</div>
      <div className="grid grid-cols-3 gap-2">
        <NumberInput label="X" value={value.x} onChange={(x) => onChange({ ...value, x })} />
        <NumberInput label="Y" value={value.y} onChange={(y) => onChange({ ...value, y })} />
        <NumberInput label="Z" value={value.z} onChange={(z) => onChange({ ...value, z })} />
      </div>
    </div>
  );
}

function DimensionInputs({ value, onChange }: { value: Dimensions; onChange: (value: Dimensions) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-zinc-300">Dimensions</div>
      <div className="grid grid-cols-3 gap-2">
        <NumberInput label="W" value={value.width} onChange={(width) => onChange({ ...value, width })} />
        <NumberInput label="H" value={value.height} onChange={(height) => onChange({ ...value, height })} />
        <NumberInput label="D" value={value.depth} onChange={(depth) => onChange({ ...value, depth })} />
      </div>
    </div>
  );
}

export function RightPropertiesPanel() {
  const selectedObjectIds = useStudio3DStore((state) => state.selectedObjectIds);
  const object = useStudio3DStore((state) => state.sceneObjects.find((item) => item.id === selectedObjectIds[0]));
  const updateObject = useStudio3DStore((state) => state.updateObject);

  return (
    <aside className="flex w-96 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#15171d] p-4">
      <ObjectHierarchyPanel />
      <section className="mt-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-100">Property Inspector</h2>
        {!object ? <div className="rounded-md border border-dashed border-white/10 p-4 text-xs text-zinc-500">Select an object to edit properties.</div> : (
          <div className="space-y-4 rounded-md border border-white/10 bg-zinc-900/60 p-3">
            <label className="block text-xs text-zinc-400">Object name<input value={object.name} onChange={(event) => updateObject(object.id, { name: event.target.value })} className="mt-1 h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none" /></label>
            <VectorInputs title="Position" value={object.position} onChange={(position) => updateObject(object.id, { position })} />
            <VectorInputs title="Rotation" value={object.rotation} onChange={(rotation) => updateObject(object.id, { rotation })} />
            <VectorInputs title="Scale" value={object.scale} onChange={(scale) => updateObject(object.id, { scale })} />
            <DimensionInputs value={object.dimensions} onChange={(dimensions) => updateObject(object.id, { dimensions })} />
            <label className="block text-xs text-zinc-400">Production notes<textarea value={object.productionData.notes ?? ""} onChange={(event) => updateObject(object.id, { productionData: { ...object.productionData, notes: event.target.value } })} className="mt-1 h-20 w-full resize-none rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none" /></label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => updateObject(object.id, { isVisible: !object.isVisible })} className="flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">{object.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />} Visible</button>
              <button onClick={() => updateObject(object.id, { isLocked: !object.isLocked })} className="flex items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10">{object.isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />} Lock</button>
            </div>
          </div>
        )}
      </section>
      <LayerPanel />
      <MaterialPanel />
      <ProductMockupPanel />
      <ExportPanel />
      <AI3DAssistantPanel />
      <OrderQuotationPanel />
    </aside>
  );
}
