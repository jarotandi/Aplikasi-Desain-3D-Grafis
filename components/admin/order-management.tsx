"use client";

import { useEffect, useMemo, useState } from "react";
import { Factory, FileDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNative } from "@/components/ui/select";
import { assignVendorToOrder, listProductionOrders, listVendors, updateOrderStatus } from "@/lib/production/storage";
import { orderStatuses } from "@/lib/production/types";
import type { ProductionOrder, VendorRecord } from "@/lib/production/types";
import type { OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function AdminOrderManagement() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  function refresh() {
    setOrders(listProductionOrders());
    setVendors(listVendors());
  }

  useEffect(() => {
    queueMicrotask(refresh);
  }, []);

  const filtered = useMemo(() => (statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)), [orders, statusFilter]);

  function handleAssign(orderId: string, vendorId: string) {
    assignVendorToOrder(orderId, vendorId);
    refresh();
  }

  function handleStatus(orderId: string, status: OrderStatus) {
    updateOrderStatus(orderId, status, "admin");
    refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>All Orders</CardTitle>
          <p className="text-sm text-muted-foreground">Assign vendor, update status, dan lihat file produksi.</p>
        </div>
        <div className="flex gap-2">
          <SelectNative value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")} className="w-56">
            <option value="all">All status</option>
            {orderStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
          </SelectNative>
          <Button variant="outline" onClick={refresh}><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr]">
              <div>
                <p className="font-bold">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.customerName} - {order.quotationNumber}</p>
                <p className="mt-2 text-sm font-semibold">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div>
                <Badge className="capitalize">{order.status.replaceAll("_", " ")}</Badge>
                <p className="mt-2 text-sm text-slate-500">Deadline {order.productionDeadline}</p>
              </div>
              <SelectNative value={order.assignedVendorId ?? ""} onChange={(event) => handleAssign(order.id, event.target.value)}>
                <option value="">Assign vendor</option>
                {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.companyName}</option>)}
              </SelectNative>
              <SelectNative value={order.status} onChange={(event) => handleStatus(order.id, event.target.value as OrderStatus)}>
                {orderStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
              </SelectNative>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.productName}`} className="rounded-xl bg-white p-3 text-sm">
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-slate-500">{item.quantity} pcs - {item.specs}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.files.map((file) => (
                <Button key={file.id} variant="outline" size="sm">
                  <FileDown className="h-4 w-4" />
                  {file.fileName}
                </Button>
              ))}
              <Button variant="outline" size="sm"><Factory className="h-4 w-4" />Production notes</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
