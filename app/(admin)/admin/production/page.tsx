import { AppShell } from "@/components/layout/app-shell";
import { ProductionBoard } from "@/components/admin/production-board";

export default function AdminProductionPage() {
  return (
    <AppShell role="admin" title="Production Board" description="Kanban produksi dari approval sampai completed.">
      <ProductionBoard />
    </AppShell>
  );
}
