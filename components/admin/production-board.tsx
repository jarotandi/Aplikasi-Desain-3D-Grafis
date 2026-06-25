"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listProductionOrders, updateOrderStatus } from "@/lib/production/storage";
import { productionBoardStatuses } from "@/lib/production/types";
import type { ProductionOrder } from "@/lib/production/types";
import type { OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";

const columnLabel: Record<OrderStatus, string> = {
  draft: "Draft",
  quotation_requested: "Quotation Requested",
  waiting_payment: "Waiting Payment",
  paid_dp: "Paid DP",
  design_review: "Design Review",
  waiting_approval: "Waiting Approval",
  approved_for_production: "Ready Production",
  assigned_to_vendor: "Assigned Vendor",
  in_production: "In Production",
  quality_check: "QC",
  packing: "Packing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled"
};

export function ProductionBoard() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);

  function refresh() {
    setOrders(listProductionOrders());
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const grouped = useMemo(() => {
    return productionBoardStatuses.reduce<Record<string, ProductionOrder[]>>((acc, status) => {
      acc[status] = orders.filter((order) => order.status === status);
      return acc;
    }, {});
  }, [orders]);

  function move(order: ProductionOrder, direction: 1 | -1) {
    const index = productionBoardStatuses.indexOf(order.status);
    const nextStatus = productionBoardStatuses[index + direction];
    if (!nextStatus) return;
    updateOrderStatus(order.id, nextStatus, "admin", `Moved to ${nextStatus} from production board.`);
    refresh();
  }

  return (
    <div className="grid gap-4 overflow-auto xl:grid-cols-8">
      {productionBoardStatuses.map((status) => (
        <div key={status} className="min-h-[34rem] min-w-64 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">{columnLabel[status]}</p>
            <Badge>{grouped[status]?.length ?? 0}</Badge>
          </div>
          <div className="space-y-3">
            {(grouped[status] ?? []).map((order) => (
              <div key={order.id} className="rounded-2xl bg-slate-50 p-3 text-sm shadow-sm">
                <p className="font-bold">{order.orderNumber}</p>
                <p className="mt-1 text-slate-500">{order.customerName}</p>
                <p className="mt-2 font-semibold">{formatCurrency(order.totalAmount)}</p>
                <p className="mt-1 text-xs text-slate-500">Deadline {order.productionDeadline}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => move(order, -1)} disabled={productionBoardStatuses.indexOf(order.status) === 0}>Back</Button>
                  <Button size="sm" onClick={() => move(order, 1)} disabled={productionBoardStatuses.indexOf(order.status) === productionBoardStatuses.length - 1}>Next</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
