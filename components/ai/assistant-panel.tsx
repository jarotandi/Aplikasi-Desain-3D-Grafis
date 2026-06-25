"use client";

import { useMemo, useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocalRuleBasedAIProvider } from "@/lib/ai/product-advisor";

export function AssistantPanel({ context = "general" }: { context?: string }) {
  const provider = useMemo(() => new LocalRuleBasedAIProvider(), []);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Saya bisa bantu rekomendasi produk, metode cetak, validasi desain, dan estimasi paket event." }
  ]);
  const [input, setInput] = useState("");

  async function submit() {
    if (!input.trim()) return;
    const question = input;
    setInput("");
    const response = await provider.generateResponse({ message: question, context });
    setMessages((current) => [...current, { role: "user", text: question }, { role: "assistant", text: response.message }]);
  }

  return (
    <div className="rounded-2xl border bg-white/85 p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2 font-semibold">
        <Bot className="h-5 w-5 text-cyan-700" />
        Product Knowledge AI
      </div>
      <div className="max-h-72 space-y-3 overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className={message.role === "assistant" ? "rounded-xl bg-slate-100 p-3 text-sm leading-6" : "rounded-xl bg-cyan-50 p-3 text-sm leading-6"}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tanya rekomendasi produk..." onKeyDown={(event) => event.key === "Enter" && submit()} />
        <Button size="icon" onClick={submit} aria-label="Kirim">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
