"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FileDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersForVendor, updateOrderStatus } from "@/lib/production/storage";
import type { ProductionOrder } from "@/lib/production/types";
import type { OrderStatus } from "@/types";

const vendorStatuses: OrderStatus[] = ["assigned_to_vendor", "in_production", "quality_check", "packing", "shipped", "completed"];

export function VendorOrders({ vendorId = "vendor-bandung-print" }: { vendorId?: string }) {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);

  const refresh = useCallback(() => {
    setOrders(ordersForVendor(vendorId));
  }, [vendorId]);

  useEffect(() => {
    queueMicrotask(refresh);
  }, [refresh]);

  function nextStatus(order: ProductionOrder) {
    const index = vendorStatuses.indexOf(order.status);
    const next = vendorStatuses[Math.min(index + 1, vendorStatuses.length - 1)];
    updateOrderStatus(order.id, next, "vendor", `Vendor updated status to ${next}.`);
    refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assigned Production</CardTitle>
        <Button variant="outline" onClick={refresh}><RefreshCw className="h-4 w-4" />Refresh</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.customerName} - deadline {order.productionDeadline}</p>
              </div>
              <Badge className="capitalize">{order.status.replaceAll("_", " ")}</Badge>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm"><Link href={`/vendor/orders/${order.id}`}>Detail</Link></Button>
                <Button size="sm" onClick={() => nextStatus(order)}>Update status</Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.files.map((file) => <Button key={file.id} variant="outline" size="sm"><FileDown className="h-4 w-4" />{file.fileName}</Button>)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
