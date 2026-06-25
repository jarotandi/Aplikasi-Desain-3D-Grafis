import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, FileCheck, Wand2 } from "lucide-react";
import { AssistantPanel } from "@/components/ai/assistant-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKnowledgeByProductId, getProductBySlug, products } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const knowledge = getKnowledgeByProductId(product.id);

  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-100 shadow-soft">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Harga mulai</p><p className="text-xl font-semibold">{formatCurrency(product.startingPrice)}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">MOQ</p><p className="text-xl font-semibold">{product.moq} pcs</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Produksi</p><p className="text-xl font-semibold">{product.productionTime}</p></CardContent></Card>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <Badge>{product.category}</Badge>
            <h1 className="mt-3 text-4xl font-semibold">{product.name}</h1>
            <p className="mt-3 text-muted-foreground">{product.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link href={`/editor?product=${product.slug}`}><Wand2 className="h-4 w-4" />Start Design</Link></Button>
            <Button asChild variant="outline"><Link href="/bulk-order"><FileCheck className="h-4 w-4" />Request Quote</Link></Button>
            <Button asChild variant="secondary"><Link href="/mockup-studio"><Box className="h-4 w-4" />3D Preview</Link></Button>
          </div>
          <Card>
            <CardHeader><CardTitle>Product Knowledge</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                ["Material", product.materials.join(", ")],
                ["Ukuran", product.sizes.join(", ")],
                ["Warna", product.colors.join(", ")],
                ["Metode cetak", product.printMethods.join(", ")],
                ["Area desain", knowledge?.designAreas.join(", ") ?? "-"],
                ["File requirement", knowledge?.fileRequirements.join(", ") ?? "-"],
                ["Pricing tiers", knowledge?.pricingRules.join(", ") ?? "-"],
                ["Production notes", knowledge?.productionConstraints.join(", ") ?? "-"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {knowledge?.faq.map((item) => (
                <div key={item.question}>
                  <p className="font-semibold">{item.question}</p>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <AssistantPanel context={knowledge?.aiContext} />
        </div>
      </div>
    </main>
  );
}
