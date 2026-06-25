"use client";

const cameraCommands = [
  { label: "Reset camera", event: "studio:camera-reset" },
  { label: "Front view", event: "studio:camera-front" },
  { label: "Side view", event: "studio:camera-side" },
  { label: "Top view", event: "studio:camera-top" },
  { label: "Perspective", event: "studio:camera-perspective" },
  { label: "Zoom selected", event: "studio:camera-zoom-selected" }
];

export function CameraPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-slate-900/50 p-3">
      {cameraCommands.map((command) => (
        <button
          key={command.event}
          type="button"
          onClick={() => window.dispatchEvent(new Event(command.event))}
          className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
        >
          {command.label}
        </button>
      ))}
    </div>
  );
}
