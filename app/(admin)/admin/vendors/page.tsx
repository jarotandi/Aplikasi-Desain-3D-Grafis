import { AppShell } from "@/components/layout/app-shell";
import { AdminVendorManagement } from "@/components/admin/vendor-management";

export default function AdminVendorsPage() {
  return (
    <AppShell role="admin" title="Vendor Management" description="Kelola capability, capacity/day, city, price list, dan status vendor.">
      <AdminVendorManagement />
    </AppShell>
  );
}
