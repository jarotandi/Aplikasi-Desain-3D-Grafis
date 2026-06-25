import Link from "next/link";
import Image from "next/image";
import { Box, Eye, Wand2 } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden border-white/70 bg-white/85">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 100vw" />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.has2DMockup ? <Badge>2D</Badge> : null}
          {product.has3DMockup ? <Badge>3D</Badge> : null}
        </div>
      </div>
      <CardContent className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">Mulai</p>
            <p className="font-semibold">{formatCurrency(product.startingPrice)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">MOQ</p>
            <p className="font-semibold">{product.moq} pcs</p>
          </div>
          <div>
            <p className="text-muted-foreground">Produksi</p>
            <p className="font-semibold">{product.productionTime}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex-1" size="sm">
            <Link href={`/editor?product=${product.slug}`}>
              <Wand2 className="h-4 w-4" />
              Customize
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/products/${product.slug}`}>
              <Eye className="h-4 w-4" />
              Detail
            </Link>
          </Button>
          <Button asChild variant="secondary" size="icon">
            <Link href="/mockup-studio" aria-label="Mockup">
              <Box className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
