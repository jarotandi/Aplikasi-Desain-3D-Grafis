import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudioOrdersList } from "@/components/studio/StudioOrdersList";

export default function OrdersPage() {
  const statuses = ["quotation_requested", "paid_dp", "design_review", "approved_for_production", "assigned_to_vendor", "in_production", "quality_check", "packing", "shipped", "completed"];
  return (
    <AppShell title="My Orders" description="Pantau timeline order, file produksi, invoice, dan tracking pengiriman.">
      <div className="space-y-6">
        <StudioOrdersList />
      <Card>
        <CardHeader><CardTitle>Order #MDS-24001 - Event Kit Seminar</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {statuses.map((status, index) => (
              <div key={status} className="rounded-xl border bg-white p-4">
                <p className="text-xs text-muted-foreground">Step {index + 1}</p>
                <p className="mt-1 text-sm font-semibold capitalize">{status.replaceAll("_", " ")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </AppShell>
  );
}
