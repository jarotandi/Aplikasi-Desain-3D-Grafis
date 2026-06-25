"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listQuotations } from "@/lib/bulk-order/storage";
import type { BulkQuotationRecord } from "@/lib/bulk-order/types";
import { formatCurrency } from "@/lib/utils";

const fallbackRows = [
  ["QTN-MDS-0001", "Seminar Nasional", "sent", 14_850_000],
  ["QTN-MDS-0002", "Cafe Launching Kit", "draft", 7_200_000],
  ["QTN-MDS-0003", "3D Trophy Award", "approved", 3_600_000]
] as const;

export function QuotationList() {
  const [quotations, setQuotations] = useState<BulkQuotationRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => setQuotations(listQuotations()));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daftar quotation</CardTitle>
          <p className="text-sm text-muted-foreground">Quotation dari bulk event order tersimpan di localStorage fallback.</p>
        </div>
        <Button asChild>
          <Link href="/bulk-order">Buat Bulk Order</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotations.length ? (
          quotations.map((quotation) => (
            <Link key={quotation.id} href={`/quotations/${quotation.id}`} className="grid gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-white hover:shadow-panel md:grid-cols-[1.1fr_1fr_0.7fr_0.8fr]">
              <p className="font-semibold">{quotation.quotation_number}</p>
              <p>{quotation.event_info.eventName}</p>
              <Badge className="w-fit capitalize">{quotation.status.replaceAll("_", " ")}</Badge>
              <p className="font-semibold">{formatCurrency(quotation.total)}</p>
            </Link>
          ))
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl bg-cyan-50 p-5">
              <FileText className="mb-3 h-8 w-8 text-cyan-700" />
              <p className="font-semibold">Belum ada quotation lokal.</p>
              <p className="mt-1 text-sm text-muted-foreground">Jalankan wizard Bulk Event Order untuk membuat quotation detail pertama.</p>
            </div>
            {fallbackRows.map(([number, name, status, total]) => (
              <div key={number} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
                <p className="font-semibold">{number}</p>
                <p>{name}</p>
                <p className="capitalize">{status}</p>
                <p className="font-semibold">{formatCurrency(total)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
