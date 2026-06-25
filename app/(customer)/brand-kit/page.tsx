import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BrandKitPage() {
  return (
    <AppShell title="Brand Kit" description="Simpan logo, warna, font, dan catatan brand untuk dipakai di editor.">
      <Card className="max-w-3xl">
        <CardHeader><CardTitle>Profil brand</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Nama brand" />
          <Input placeholder="Upload logo placeholder" type="file" />
          <Input placeholder="Palette warna: #0f766e, #f59e0b, #111827" />
          <Input placeholder="Font utama" />
          <Textarea placeholder="Catatan brand, tone visual, dan aturan penggunaan logo" />
          <Button>Simpan Brand Kit</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
