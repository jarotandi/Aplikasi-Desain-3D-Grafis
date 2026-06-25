"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Factory, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersForVendor, listVendors } from "@/lib/production/storage";
import type { ProductionOrder, VendorRecord } from "@/lib/production/types";
import { formatCurrency } from "@/lib/utils";

export function VendorDashboard({ vendorId = "vendor-bandung-print" }: { vendorId?: string }) {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [vendor, setVendor] = useState<VendorRecord | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setOrders(ordersForVendor(vendorId));
      setVendor(listVendors().find((item) => item.id === vendorId) ?? null);
    });
  }, [vendorId]);

  const active = orders.filter((order) => ["assigned_to_vendor", "in_production", "quality_check", "packing"].includes(order.status));
  const capacityUsed = useMemo(() => Math.min(96, active.length * 22 + 28), [active.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <Card><CardContent className="p-5"><PackageCheck className="mb-4 h-6 w-6 text-[#6c63ff]" /><p className="text-sm text-muted-foreground">Assigned orders</p><p className="text-3xl font-bold">{orders.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><CalendarClock className="mb-4 h-6 w-6 text-[#ff6584]" /><p className="text-sm text-muted-foreground">Active production</p><p className="text-3xl font-bold">{active.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><Factory className="mb-4 h-6 w-6 text-[#00d4aa]" /><p className="text-sm text-muted-foreground">Capacity used</p><p className="text-3xl font-bold">{capacityUsed}%</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{vendor?.companyName ?? "Vendor"} Production Queue</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="font-bold">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.customerName} - {order.status.replaceAll("_", " ")}</p>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</div>
              <Button asChild size="sm"><Link href={`/vendor/orders/${order.id}`}>Open</Link></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
