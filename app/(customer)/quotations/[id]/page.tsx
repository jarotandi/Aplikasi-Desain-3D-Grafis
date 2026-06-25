import { AppShell } from "@/components/layout/app-shell";
import { QuotationDetail } from "@/components/quotation/quotation-detail";

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell title="Quotation Detail" description="Detail event, produk, quantity, breakdown harga, timeline produksi, dan terms DP 50%.">
      <QuotationDetail quotationId={id} />
    </AppShell>
  );
}
