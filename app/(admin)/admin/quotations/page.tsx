import { AppShell } from "@/components/layout/app-shell";
import { AdminQuotationManagement } from "@/components/admin/quotation-management";

export default function AdminQuotationsPage() {
  return (
    <AppShell role="admin" title="Quotation System" description="Create, edit, send placeholder, approve, dan convert to order.">
      <AdminQuotationManagement />
    </AppShell>
  );
}
