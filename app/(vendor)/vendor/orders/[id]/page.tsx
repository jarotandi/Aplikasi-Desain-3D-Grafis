import { AppShell } from "@/components/layout/app-shell";
import { VendorOrderDetail } from "@/components/vendor/vendor-order-detail";

export default async function VendorOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell role="vendor" title="Vendor Order Detail" description="Specs produksi, file, status update, dan proof upload placeholder.">
      <VendorOrderDetail orderId={id} />
    </AppShell>
  );
}
