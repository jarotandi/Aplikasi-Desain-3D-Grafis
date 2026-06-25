"use client";

import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";
import type { DesignAssistantSuggestion } from "@/lib/types/studio";
import { useStudioStore } from "@/lib/store/studioStore";

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestion?: DesignAssistantSuggestion;
}

function SuggestionCard({ suggestion }: { suggestion: DesignAssistantSuggestion }) {
  return (
    <div className="mt-3 space-y-3 rounded-md border border-cyan-400/20 bg-cyan-400/5 p-3">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-cyan-300">Suggested Product</div>
        <div className="text-sm font-semibold text-slate-100">{suggestion.suggestedProduct}</div>
      </div>
      <div>
        <div className="mb-2 text-[11px] uppercase tracking-wide text-cyan-300">Color Palette</div>
        <div className="space-y-2">
          {suggestion.colorPalette.map((color) => (
            <div key={color.hex} className="flex items-center gap-2 text-xs text-slate-300">
              <span className="h-5 w-5 rounded border border-white/10" style={{ backgroundColor: color.hex }} />
              <span className="font-medium">{color.name}</span>
              <span className="text-slate-500">{color.usage}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 text-xs leading-5 text-slate-300">
        <p><span className="font-semibold text-slate-100">Layout:</span> {suggestion.layoutSuggestion}</p>
        <p><span className="font-semibold text-slate-100">Material:</span> {suggestion.materialSuggestion}</p>
        <p><span className="font-semibold text-slate-100">Logo:</span> {suggestion.logoPositionSuggestion}</p>
        <p><span className="font-semibold text-slate-100">Production:</span> {suggestion.estimatedProductionNotes}</p>
      </div>
      <div className="rounded-md border border-white/10 bg-slate-950 p-2 text-[11px] leading-5 text-slate-400">
        <div className="mb-1 font-semibold text-slate-200">Prompt for image generation</div>
        {suggestion.promptForImageGeneration}
      </div>
    </div>
  );
}

export function AIDesignAssistantPanel() {
  const objects = useStudioStore((state) => state.objects);
  const [prompt, setPrompt] = useState("Buatkan desain hoodie tema futsal warna hitam emas untuk event komunitas.");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Ketik brief desain produk. Saya akan bantu rekomendasikan produk, warna, layout, material, posisi logo, estimasi produksi, dan prompt image generation."
    }
  ]);

  const submitPrompt = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) return;

    const userMessage: AssistantMessage = { id: `user-${Date.now()}`, role: "user", text: cleanPrompt };
    setMessages((current) => [...current, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/design-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt, sceneData: { objects } })
      });

      if (!response.ok) {
        throw new Error("AI assistant request failed.");
      }

      const data = (await response.json()) as { suggestion: DesignAssistantSuggestion };
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: "Berikut rekomendasi desain awal berdasarkan brief Anda.",
          suggestion: data.suggestion
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: error instanceof Error ? error.message : "AI assistant sedang tidak tersedia."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex max-h-[720px] flex-col rounded-md border border-white/10 bg-slate-900/60">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-cyan-400/15 text-cyan-200">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">AI Design Assistant</div>
          <div className="text-[11px] text-slate-500">Mock mode, ready for OpenAI API</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((message) => (
          <div key={message.id} className={message.role === "user" ? "ml-6" : "mr-2"}>
            <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
              {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
              {message.role}
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs leading-5 text-slate-300">{message.text}</div>
            {message.suggestion ? <SuggestionCard suggestion={message.suggestion} /> : null}
          </div>
        ))}
        {isLoading ? <div className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-500">Generating recommendation...</div> : null}
      </div>

      <div className="border-t border-white/10 p-3">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              void submitPrompt();
            }
          }}
          className="h-24 w-full resize-none rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-400"
          placeholder="Contoh: Buatkan desain hoodie tema futsal warna hitam emas untuk event komunitas."
        />
        <button
          type="button"
          onClick={() => void submitPrompt()}
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          Send Prompt
        </button>
      </div>
    </div>
  );
}
