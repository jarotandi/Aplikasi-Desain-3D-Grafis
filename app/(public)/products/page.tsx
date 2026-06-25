import { ProductCard } from "@/components/product/product-card";
import { products } from "@/lib/data/products";

export default function ProductsPage() {
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return (
    <main className="min-h-screen px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">Product Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold">Katalog produk custom</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Pilih produk, lihat knowledge produksi, lalu mulai desain atau request quotation.</p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full border bg-white/80 px-4 py-2 text-sm font-medium">{category}</span>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </main>
  );
}
