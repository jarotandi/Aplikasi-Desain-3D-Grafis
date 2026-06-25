import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <Card className="w-full max-w-lg border-white/70 bg-white/90">
        <CardHeader>
          <CardTitle>Buat akun</CardTitle>
          <p className="text-sm text-muted-foreground">Form register dengan struktur role customer, vendor, dan admin.</p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Nama lengkap" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Perusahaan / brand" />
          <SelectNative defaultValue="customer">
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </SelectNative>
          <Button asChild><Link href="/dashboard">Register</Link></Button>
        </CardContent>
      </Card>
    </main>
  );
}
