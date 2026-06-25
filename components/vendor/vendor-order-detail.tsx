"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Camera, FileDown, Save, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectNative } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addProductionUpdate, getProductionOrder, updateOrderStatus } from "@/lib/production/storage";
import type { ProductionOrder } from "@/lib/production/types";
import type { OrderStatus } from "@/types";

const vendorStatuses: OrderStatus[] = ["assigned_to_vendor", "in_production", "quality_check", "packing", "shipped", "completed"];

export function VendorOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<ProductionOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>("assigned_to_vendor");
  const [note, setNote] = useState("Produksi berjalan sesuai jadwal.");
  const [proofName, setProofName] = useState("Belum ada proof/photo.");

  const refresh = useCallback(() => {
    const current = getProductionOrder(orderId);
    setOrder(current);
    if (current) setStatus(current.status);
  }, [orderId]);

  useEffect(() => {
    queueMicrotask(refresh);
  }, [refresh]);

  function handleProof(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !order) return;
    setProofName(file.name);
    addProductionUpdate({
      orderId: order.id,
      vendorId: order.assignedVendorId,
      status,
      note: `Production proof uploaded: ${file.name}`,
      proofUrl: "#",
      createdBy: "vendor"
    });
    event.target.value = "";
  }

  function saveUpdate() {
    if (!order) return;
    updateOrderStatus(order.id, status, "vendor", note);
    refresh();
  }

  if (!order) return <Card><CardContent className="p-6">Order tidak ditemukan.</CardContent></Card>;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{order.orderNumber}</CardTitle>
            <p className="text-sm text-muted-foreground">{order.customerName} - deadline {order.productionDeadline}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className="capitalize">{order.status.replaceAll("_", " ")}</Badge>
            <div className="grid gap-3 md:grid-cols-2">
              {order.items.map((item) => (
                <div key={item.productName} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold">{item.productName}</p>
                  <p className="text-sm text-slate-500">{item.quantity} pcs - {item.specs}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Production Files</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {order.files.map((file) => <Button key={file.id} variant="outline"><FileDown className="h-4 w-4" />{file.fileName}</Button>)}
          </CardContent>
        </Card>
      </div>
      <aside className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Update Production</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <SelectNative value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
              {vendorStatuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
            </SelectNative>
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
            <label className="block rounded-2xl border bg-slate-50 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 font-semibold"><Upload className="h-4 w-4" />Upload proof/photo placeholder</div>
              <input type="file" accept="image/*" onChange={handleProof} />
              <p className="mt-2 text-xs text-slate-500">{proofName}</p>
            </label>
            <Button className="w-full" onClick={saveUpdate}><Save className="h-4 w-4" />Save Update</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Camera className="mb-3 h-7 w-7 text-[#6c63ff]" />
            <p className="font-bold">Proof upload placeholder</p>
            <p className="mt-2 text-sm text-slate-500">Saat Supabase Storage aktif, file proof akan masuk bucket production-files.</p>
          </CardContent>
        </Card>
        <Button asChild variant="outline" className="w-full"><Link href="/vendor/orders">Back to orders</Link></Button>
      </aside>
    </div>
  );
}
