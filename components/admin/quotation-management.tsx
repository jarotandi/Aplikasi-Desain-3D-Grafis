"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listQuotations } from "@/lib/bulk-order/storage";
import type { BulkQuotationRecord } from "@/lib/bulk-order/types";
import { formatCurrency } from "@/lib/utils";

export function AdminQuotationManagement() {
  const [quotations, setQuotations] = useState<BulkQuotationRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => setQuotations(listQuotations()));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quotation Queue</CardTitle>
        <p className="text-sm text-muted-foreground">Review quotation, mark approved, dan convert to order placeholder.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotations.length ? quotations.map((quotation) => (
          <div key={quotation.id} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr]">
            <p className="font-bold">{quotation.quotation_number}</p>
            <p>{quotation.event_info.eventName}</p>
            <Badge className="w-fit capitalize">{quotation.status.replaceAll("_", " ")}</Badge>
            <p className="font-semibold">{formatCurrency(quotation.total)}</p>
            <Button asChild size="sm"><Link href={`/quotations/${quotation.id}`}>View</Link></Button>
          </div>
        )) : (
          <div className="rounded-2xl bg-cyan-50 p-5 text-sm text-cyan-900">
            Belum ada quotation lokal. Buat dari Bulk Event Order Wizard.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
