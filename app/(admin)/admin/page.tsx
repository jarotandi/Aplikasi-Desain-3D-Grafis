import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const stats = [["Total users", "1.248"], ["Total orders", "328"], ["Revenue estimate", formatCurrency(482500000)], ["Active production", "42"], ["Pending quotation", "17"]];
  return (
    <AppShell role="admin" title="Admin Dashboard" description="Monitoring produk, quotation, vendor, produksi, dan analytics.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value]) => <Card key={label}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Top products</CardTitle></CardHeader><CardContent className="space-y-3">{products.slice(0, 6).map((product) => <div key={product.id} className="flex justify-between rounded-xl bg-slate-50 p-3"><span>{product.name}</span><span>{product.category}</span></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Vendor workload</CardTitle></CardHeader><CardContent className="space-y-3">{["Vendor Bandung Print", "Jakarta Apparel Works", "Surabaya 3D Lab"].map((vendor, index) => <div key={vendor} className="rounded-xl bg-slate-50 p-4"><p className="font-semibold">{vendor}</p><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-cyan-600" style={{ width: `${55 + index * 15}%` }} /></div></div>)}</CardContent></Card>
      </div>
    </AppShell>
  );
}
