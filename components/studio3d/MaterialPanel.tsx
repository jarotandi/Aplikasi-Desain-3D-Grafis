"use client";

import { useStudio3DStore } from "@/store/studio3dStore";

export function MaterialPanel() {
  const materials = useStudio3DStore((state) => state.materials);
  const selectedObjectIds = useStudio3DStore((state) => state.selectedObjectIds);
  const selectedObject = useStudio3DStore((state) => state.sceneObjects.find((object) => object.id === selectedObjectIds[0]));
  const applyMaterialToSelected = useStudio3DStore((state) => state.applyMaterialToSelected);
  const updateMaterial = useStudio3DStore((state) => state.updateMaterial);
  const material = materials.find((item) => item.id === selectedObject?.materialId) ?? materials[0];

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">Material Panel</h2>
      <div className="space-y-3 rounded-md border border-white/10 bg-zinc-900/60 p-3">
        <select value={material.id} onChange={(event) => applyMaterialToSelected(event.target.value)} className="h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200">
          {materials.map((item) => <option key={item.id} value={item.id}>{item.category} / {item.name}</option>)}
        </select>
        <label className="block text-xs text-zinc-400">Color<input type="color" value={material.color} onChange={(event) => updateMaterial(material.id, { color: event.target.value })} className="mt-1 h-9 w-full rounded-md border border-white/10 bg-zinc-950" /></label>
        {(["roughness", "metalness", "opacity"] as const).map((key) => (
          <label key={key} className="block text-xs text-zinc-400"><span className="flex justify-between capitalize"><span>{key}</span><span>{material[key].toFixed(2)}</span></span><input type="range" min={0} max={1} step={0.01} value={material[key]} onChange={(event) => updateMaterial(material.id, { [key]: Number(event.target.value) })} className="mt-1 w-full accent-cyan-400" /></label>
        ))}
        <label className="block text-xs text-zinc-400">Upload texture<input type="file" accept="image/png,image/jpeg" className="mt-1 w-full rounded-md border border-white/10 bg-zinc-950 px-2 py-2 text-xs text-zinc-300" /></label>
      </div>
    </section>
  );
}
