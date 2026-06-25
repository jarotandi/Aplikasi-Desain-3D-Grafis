"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listProductionOrders, listVendors } from "@/lib/production/storage";
import type { ProductionOrder, VendorRecord } from "@/lib/production/types";
import { formatCurrency } from "@/lib/utils";

const colors = ["#6c63ff", "#ff6584", "#00d4aa", "#60a5fa", "#f59e0b", "#1a1a2e"];

export function AnalyticsDashboard() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setOrders(listProductionOrders());
      setVendors(listVendors());
    });
  }, []);

  const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeProduction = orders.filter((order) => ["assigned_to_vendor", "in_production", "quality_check", "packing"].includes(order.status)).length;
  const completed = orders.filter((order) => order.status === "completed").length;

  const monthly = useMemo(() => {
    const base = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
      month,
      orders: Math.max(1, Math.round((orders.length + index) * (index % 2 ? 1.2 : 0.8))),
      revenue: Math.round(revenue / 6 + index * 1_500_000)
    }));
    return base;
  }, [orders.length, revenue]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    orders.flatMap((order) => order.items).forEach((item) => map.set(item.category, (map.get(item.category) ?? 0) + item.quantity));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const workload = vendors.map((vendor) => ({
    name: vendor.companyName.replace(" House", "").replace(" Works", "").replace(" Lab", ""),
    orders: orders.filter((order) => order.assignedVendorId === vendor.id).length
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Orders", orders.length],
          ["Revenue estimate", formatCurrency(revenue)],
          ["Active production", activeProduction],
          ["Completed", completed]
        ].map(([label, value]) => <Card key={label as string}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label as string}</p><p className="mt-2 text-2xl font-bold">{value as string}</p></CardContent></Card>)}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Orders per Month</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#6c63ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue Estimate</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="revenue" stroke="#ff6584" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Product Categories</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" outerRadius={92} label>
                  {categories.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vendor Workload</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#00d4aa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
