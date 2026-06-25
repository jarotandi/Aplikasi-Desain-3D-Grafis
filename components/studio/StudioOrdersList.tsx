"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listStudioQuotations } from "@/lib/studio-orders/storage";
import type { StudioOrderStatus, StudioQuotationRequest } from "@/lib/types/studioOrder";

const statuses: StudioOrderStatus[] = ["draft", "waiting_quotation", "quoted", "approved", "production", "shipped", "completed"];

function statusIndex(status: StudioOrderStatus) {
  return Math.max(0, statuses.indexOf(status));
}

export function StudioOrdersList() {
  const [orders, setOrders] = useState<StudioQuotationRequest[]>([]);

  useEffect(() => {
    queueMicrotask(() => setOrders(listStudioQuotations()));
  }, []);

  const summary = useMemo(
    () => ({
      total: orders.length,
      waiting: orders.filter((order) => order.status === "waiting_quotation").length,
      production: orders.filter((order) => order.status === "production").length
    }),
    [orders]
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">3D quotation requests</p><p className="mt-1 text-3xl font-semibold">{summary.total}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Waiting quotation</p><p className="mt-1 text-3xl font-semibold">{summary.waiting}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">In production</p><p className="mt-1 text-3xl font-semibold">{summary.production}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>3D Product Studio Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Belum ada request quotation dari 3D Product Studio.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{order.quotationNumber}</p>
                    <h3 className="mt-1 text-lg font-semibold">{order.product} - {order.quantity} pcs</h3>
                    <p className="mt-1 text-sm text-slate-500">{order.material} / {order.printMethod} / Deadline {order.deadline || "TBD"}</p>
                  </div>
                  <Badge className="capitalize">{order.status.replaceAll("_", " ")}</Badge>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-7">
                  {statuses.map((status, index) => (
                    <div key={status} className={index <= statusIndex(order.status) ? "rounded-xl bg-[#1a1a2e] p-3 text-white" : "rounded-xl bg-slate-100 p-3 text-slate-500"}>
                      <p className="text-[11px]">Step {index + 1}</p>
                      <p className="mt-1 text-xs font-semibold capitalize">{status.replaceAll("_", " ")}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-slate-400">Size breakdown</p>
                    <p className="mt-1 font-medium">{Object.entries(order.sizeBreakdown).map(([size, qty]) => `${size}: ${qty}`).join(", ") || "Not specified"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase text-slate-400">Customer note</p>
                    <p className="mt-1 font-medium">{order.customerNote || "No note"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
