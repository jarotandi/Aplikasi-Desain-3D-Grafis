import { AppShell } from "@/components/layout/app-shell";
import { AdminOrderManagement } from "@/components/admin/order-management";

export default function AdminOrdersPage() {
  return (
    <AppShell role="admin" title="Order Management" description="Filter status, assign vendor, update status, dan lihat production files.">
      <AdminOrderManagement />
    </AppShell>
  );
}
