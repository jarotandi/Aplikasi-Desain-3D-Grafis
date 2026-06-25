import { AppShell } from "@/components/layout/app-shell";
import { VendorOrders } from "@/components/vendor/vendor-orders";

export default function VendorOrdersPage() {
  return (
    <AppShell role="vendor" title="Assigned Orders" description="Download files, lihat specs, update status, dan upload proof placeholder.">
      <VendorOrders />
    </AppShell>
  );
}
