import { AppShell } from "@/components/layout/app-shell";
import { QuotationList } from "@/components/quotation/quotation-list";

export default function QuotationsPage() {
  return (
    <AppShell title="Quotation" description="Lihat quotation, approve, request revision, dan download PDF placeholder.">
      <QuotationList />
    </AppShell>
  );
}
