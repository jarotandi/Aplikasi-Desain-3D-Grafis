import { AppShell } from "@/components/layout/app-shell";
import { VendorDashboard } from "@/components/vendor/vendor-dashboard";

export default function VendorDashboardPage() {
  return (
    <AppShell role="vendor" title="Vendor Dashboard" description="Assigned orders, production queue, deadlines, dan capacity settings.">
      <VendorDashboard />
    </AppShell>
  );
}
