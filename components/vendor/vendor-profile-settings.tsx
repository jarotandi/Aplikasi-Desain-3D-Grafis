"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listVendors, saveVendor } from "@/lib/production/storage";
import type { VendorRecord } from "@/lib/production/types";

export function VendorProfileSettings({ vendorId = "vendor-bandung-print" }: { vendorId?: string }) {
  const [vendor, setVendor] = useState<VendorRecord | null>(null);

  useEffect(() => {
    queueMicrotask(() => setVendor(listVendors().find((item) => item.id === vendorId) ?? null));
  }, [vendorId]);

  if (!vendor) return <Card><CardContent className="p-6">Vendor tidak ditemukan.</CardContent></Card>;

  function update(patch: Partial<VendorRecord>) {
    if (!vendor) return;
    setVendor({ ...vendor, ...patch });
  }

  function save() {
    if (!vendor) return;
    saveVendor({ ...vendor, updatedAt: new Date().toISOString() });
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader><CardTitle>Profil vendor & capacity settings</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <Input value={vendor.companyName} onChange={(event) => update({ companyName: event.target.value })} />
        <Input value={vendor.location} onChange={(event) => update({ location: event.target.value })} />
        <Input value={vendor.contactPhone} onChange={(event) => update({ contactPhone: event.target.value })} />
        <Input value={vendor.productionMethods.join(", ")} onChange={(event) => update({ productionMethods: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
        <Input value={vendor.capabilities.join(", ")} onChange={(event) => update({ capabilities: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(vendor.capacityPerDay).map(([key, value]) => (
            <label key={key} className="grid gap-2 text-xs font-semibold text-slate-500">
              Capacity {key}/day
              <Input type="number" value={value} onChange={(event) => update({ capacityPerDay: { ...vendor.capacityPerDay, [key]: Number(event.target.value) } })} />
            </label>
          ))}
        </div>
        <Button onClick={save}>Simpan Profile</Button>
      </CardContent>
    </Card>
  );
}
