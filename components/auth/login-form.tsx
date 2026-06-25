"use client";

import Link from "next/link";
import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";

const roleRedirect = {
  customer: "/dashboard",
  vendor: "/vendor",
  admin: "/admin"
} as const;

export function LoginForm() {
  const [role, setRole] = useState<keyof typeof roleRedirect>("customer");

  return (
    <Card className="w-full max-w-md border-white/70 bg-white/90">
      <CardHeader>
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white">
          <Palette />
        </div>
        <CardTitle>Masuk ke MerchDesign Studio</CardTitle>
        <p className="text-sm text-muted-foreground">Supabase Auth siap disambungkan. Untuk MVP, pilih role untuk simulasi redirect.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <SelectNative value={role} onChange={(event) => setRole(event.target.value as keyof typeof roleRedirect)}>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </SelectNative>
        <Button asChild className="w-full">
          <Link href={roleRedirect[role]}>Login sebagai {role === "customer" ? "Customer" : role === "vendor" ? "Vendor" : "Admin"}</Link>
        </Button>
        <div className="flex justify-between text-sm text-muted-foreground">
          <Link href="/register">Buat akun</Link>
          <span>Forgot password</span>
        </div>
      </CardContent>
    </Card>
  );
}
