"use client";

import { useMemo, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { LocalRuleBasedAIProvider } from "@/lib/ai/product-advisor";
import type { AIResponse } from "@/lib/ai/types";
import { products } from "@/lib/data/products";

const prompts = [
  "Saya mau seminar 200 orang budget 15 juta",
  "Desain saya full color dan banyak gradasi, cocok pakai metode apa?",
  "Tolong validasi desain saya untuk safe zone dan resolusi",
  "Ada alternatif produk yang lebih murah untuk event kampus?",
  "Saya mau bikin keychain 3D printing, apa warning produksinya?",
  "Packaging UMKM kopi sebaiknya pakai produk apa?"
];

export function ProductAdvisorWorkbench() {
  const provider = useMemo(() => new LocalRuleBasedAIProvider(), []);
  const [message, setMessage] = useState(prompts[0]);
  const [productId, setProductId] = useState(products[0].id);
  const [response, setResponse] = useState<AIResponse | null>(null);

  async function ask(input = message) {
    const result = await provider.generateResponse({ message: input, productId });
    setResponse(result);
    setMessage(input);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#6c63ff]" />
          <p className="font-bold">AI Product Advisor</p>
        </div>
        <div className="space-y-4">
          <label className="grid gap-2 text-xs font-semibold text-slate-500">
            Product context
            <SelectNative value={productId} onChange={(event) => setProductId(event.target.value)}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </SelectNative>
          </label>
          <div className="flex gap-2">
            <Input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && ask()} />
            <Button size="icon" onClick={() => ask()} aria-label="Ask">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => ask(prompt)} className="w-full rounded-2xl bg-slate-50 p-3 text-left text-sm text-slate-600 transition hover:bg-white hover:shadow-panel">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#ff6584]" />
            Advisor Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          {response ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-cyan-50 p-5 text-sm leading-7 text-slate-700">{response.message}</div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-400">Intent</p><p className="font-bold">{response.intent}</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-400">Confidence</p><p className="font-bold">{Math.round(response.confidence * 100)}%</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-400">Sources</p><p className="font-bold">{response.sources.join(", ")}</p></div>
              </div>
              {response.recommendations?.printMethods ? <RecommendationBlock title="Print methods" items={response.recommendations.printMethods} /> : null}
              {response.recommendations?.warnings ? <RecommendationBlock title="Warnings" items={response.recommendations.warnings} /> : null}
              {response.recommendations?.productIds ? <RecommendationBlock title="Products" items={response.recommendations.productIds.map((id) => products.find((product) => product.id === id)?.name ?? id)} /> : null}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">Pilih prompt atau ketik pertanyaan untuk melihat rekomendasi rule-based.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RecommendationBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 font-bold">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
