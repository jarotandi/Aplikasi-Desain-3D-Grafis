import { AppShell } from "@/components/layout/app-shell";
import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/data/products";

export default function AdminProductsPage() {
  return (
    <AppShell role="admin" title="Product Management" description="Create, edit, upload image/model, set pricing, dan attach knowledge.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </AppShell>
  );
}
