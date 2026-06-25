import { BulkOrderWizard } from "@/components/bulk-order/bulk-order-wizard";
import { AppShell } from "@/components/layout/app-shell";

export default function BulkOrderPage() {
  return (
    <AppShell title="Bulk Event Order" description="Wizard order massal untuk seminar, launching, komunitas, dan corporate event.">
      <BulkOrderWizard />
    </AppShell>
  );
}
