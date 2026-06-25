"use client";

import { PropertiesPanel } from "@/components/studio/PropertiesPanel";
import { SceneOutliner } from "@/components/studio/SceneOutliner";
import { CameraPanel } from "@/components/studio/CameraPanel";
import { LightingPanel } from "@/components/studio/LightingPanel";
import { ModelingPanel } from "@/components/studio/ModelingPanel";
import { ModifierPanel } from "@/components/studio/ModifierPanel";
import { AIDesignAssistantPanel } from "@/components/studio/AIDesignAssistantPanel";
import { useStudioStore } from "@/lib/store/studioStore";

export function RightPanel() {
  const renderJobs = useStudioStore((state) => state.renderJobs);
  const pollRenderJob = useStudioStore((state) => state.pollRenderJob);
  const activeTool = useStudioStore((state) => state.activeTool);

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-slate-950 p-4">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Scene Outliner</h2>
          <span className="text-xs text-slate-500">Objects</span>
        </div>
        <SceneOutliner />
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Properties</h2>
          <span className="text-xs text-slate-500">Transform</span>
        </div>
        <PropertiesPanel />
      </section>

      <section className="mt-6">
        <div className="mb-3 text-sm font-semibold text-slate-100">Modeling</div>
        <ModelingPanel />
      </section>

      <section className="mt-6">
        <div className="mb-3 text-sm font-semibold text-slate-100">Modifiers</div>
        <ModifierPanel />
      </section>

      {activeTool === "camera" ? (
        <section className="mt-6">
          <div className="mb-3 text-sm font-semibold text-slate-100">Camera Tools</div>
          <CameraPanel />
        </section>
      ) : null}

      {activeTool === "lighting" ? (
        <section className="mt-6">
          <div className="mb-3 text-sm font-semibold text-slate-100">Lighting Tools</div>
          <LightingPanel />
        </section>
      ) : null}

      {activeTool === "ai" ? (
        <section className="mt-6">
          <AIDesignAssistantPanel />
        </section>
      ) : null}

      <section className="mt-6">
        <div className="mb-3 text-sm font-semibold text-slate-100">Render Jobs</div>
        <div className="space-y-2">
          {renderJobs.length === 0 ? <div className="rounded-md border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-500">No render jobs yet.</div> : null}
          {renderJobs.slice(0, 4).map((job) => (
            <div key={job.id} className="rounded-md border border-white/10 bg-slate-900/70 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">{job.status}</span>
                <span className="text-slate-500">{new Date(job.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">{job.message}</div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => void pollRenderJob(job.id)} className="rounded border border-white/10 px-2 py-1 text-[11px] text-slate-300 hover:bg-white/10">
                  Refresh
                </button>
                {job.previewUrl ? (
                  <a href={job.previewUrl} target="_blank" rel="noreferrer" className="rounded border border-cyan-400/30 px-2 py-1 text-[11px] text-cyan-200 hover:bg-cyan-400/10">
                    Open PNG
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
