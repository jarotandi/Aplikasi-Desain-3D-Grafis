"use client";

import { Lock, Trash2, Unlock } from "lucide-react";
import { MaterialEditor } from "@/components/studio/MaterialEditor";
import { useStudioStore } from "@/lib/store/studioStore";
import type { Transform, Vector3Tuple } from "@/lib/types/studio";

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-[11px] uppercase tracking-wide text-slate-500">
      {label}
      <input
        type="number"
        step={0.1}
        value={Number(value.toFixed(3))}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 h-8 w-full rounded-md border border-white/10 bg-slate-950 px-2 text-xs normal-case text-slate-200 outline-none focus:border-cyan-400"
      />
    </label>
  );
}

function TransformRow({ label, values, onChange }: { label: keyof Transform; values: Vector3Tuple; onChange: (values: Vector3Tuple) => void }) {
  const axes = ["X", "Y", "Z"] as const;
  return (
    <div>
      <div className="mb-2 text-xs font-medium capitalize text-slate-300">{label}</div>
      <div className="grid grid-cols-3 gap-2">
        {axes.map((axis, index) => (
          <NumberField
            key={axis}
            label={axis}
            value={values[index]}
            onChange={(nextValue) => {
              const next = [...values] as Vector3Tuple;
              next[index] = nextValue;
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PropertiesPanel() {
  const selectedObjectId = useStudioStore((state) => state.selectedObjectId);
  const object = useStudioStore((state) => state.objects.find((item) => item.id === selectedObjectId));
  const updateObject = useStudioStore((state) => state.updateObject);
  const setTransform = useStudioStore((state) => state.setTransform);
  const deleteObject = useStudioStore((state) => state.deleteObject);

  if (!object) {
    return <div className="rounded-md border border-dashed border-white/10 p-4 text-sm text-slate-500">Select an object to edit its transform and material.</div>;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <label className="block text-xs text-slate-400">
          Name
          <input
            value={object.name}
            onChange={(event) => updateObject(object.id, { name: event.target.value })}
            className="mt-1 h-9 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:border-cyan-400"
          />
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button type="button" onClick={() => updateObject(object.id, { visible: !object.visible })} className="rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-slate-200 hover:bg-white/10">
            {object.visible ? "Visible" : "Hidden"}
          </button>
          <button type="button" onClick={() => updateObject(object.id, { locked: !object.locked })} className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-slate-200 hover:bg-white/10">
            {object.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            {object.locked ? "Locked" : "Unlocked"}
          </button>
        </div>
      </div>

      <TransformRow label="position" values={object.transform.position} onChange={(position) => setTransform(object.id, { position })} />
      <TransformRow label="rotation" values={object.transform.rotation} onChange={(rotation) => setTransform(object.id, { rotation })} />
      <TransformRow label="scale" values={object.transform.scale} onChange={(scale) => setTransform(object.id, { scale })} />

      <div>
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Material</div>
        <MaterialEditor object={object} />
      </div>

      <button type="button" onClick={() => deleteObject(object.id)} className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20">
        <Trash2 className="h-4 w-4" />
        Delete object
      </button>
    </div>
  );
}
