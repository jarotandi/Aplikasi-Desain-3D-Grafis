"use client";

import { useEffect, useState } from "react";
import { Factory, MapPin, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";
import { listVendors, saveVendor } from "@/lib/production/storage";
import type { VendorRecord } from "@/lib/production/types";

export function AdminVendorManagement() {
  const [vendors, setVendors] = useState<VendorRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => setVendors(listVendors()));
  }, []);

  function updateVendor(vendor: VendorRecord, patch: Partial<VendorRecord>) {
    const updated = saveVendor({ ...vendor, ...patch, updatedAt: new Date().toISOString() });
    setVendors(listVendors().map((item) => (item.id === updated.id ? updated : item)));
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {vendors.map((vendor) => (
        <Card key={vendor.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Factory className="h-5 w-5 text-[#6c63ff]" />{vendor.companyName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-slate-500">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{vendor.location}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{vendor.contactPhone}</p>
            </div>
            <Input value={vendor.companyName} onChange={(event) => updateVendor(vendor, { companyName: event.target.value })} />
            <Input value={vendor.location} onChange={(event) => updateVendor(vendor, { location: event.target.value })} />
            <SelectNative value={vendor.status} onChange={(event) => updateVendor(vendor, { status: event.target.value as VendorRecord["status"] })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectNative>
            <div className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="font-semibold">Methods</p>
              <p className="text-slate-500">{vendor.productionMethods.join(", ")}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="font-semibold">Capacity/day</p>
              <p className="text-slate-500">{Object.entries(vendor.capacityPerDay).map(([k, v]) => `${k}: ${v}`).join(", ")}</p>
            </div>
            <Button className="w-full" onClick={() => updateVendor(vendor, {})}><Save className="h-4 w-4" />Save Vendor</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
