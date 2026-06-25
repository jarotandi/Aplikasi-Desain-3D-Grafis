"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";
import { generateSceneFromPrompt } from "@/services/ai/designAssistant";
import { useStudio3DStore } from "@/store/studio3dStore";

export function AI3DAssistantPanel() {
  const [prompt, setPrompt] = useState("Buatkan booth event ukuran 3x3 meter dengan backdrop, meja display, banner samping, dan lampu.");
  const [result, setResult] = useState("");
  const addObject = useStudio3DStore((state) => state.addObject);
  const setUnit = useStudio3DStore((state) => state.setUnit);

  const generate = async () => {
    const scene = await generateSceneFromPrompt(prompt);
    setResult(JSON.stringify(scene, null, 2));
    setUnit(scene.unit);
    scene.objects.forEach((object) => {
      addObject(object.type, {
        name: object.name,
        dimensions: object.dimensions,
        position: object.position,
        materialId: object.material === "wood" ? "mat-wood" : object.material === "plywood" ? "mat-plywood" : "mat-cotton"
      });
    });
  };

  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-100">AI 3D Assistant</h2>
      <div className="space-y-3 rounded-md border border-white/10 bg-zinc-900/60 p-3">
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="h-24 w-full resize-none rounded-md border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none" />
        <button onClick={() => void generate()} className="flex w-full items-center justify-center gap-2 rounded-md bg-purple-400 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-purple-300"><Wand2 className="h-4 w-4" /> Generate scene mock</button>
        {result ? <pre className="max-h-48 overflow-auto rounded-md bg-zinc-950 p-3 text-[11px] text-zinc-400">{result}</pre> : null}
      </div>
    </section>
  );
}
