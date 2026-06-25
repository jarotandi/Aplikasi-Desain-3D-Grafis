import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Box, Factory, Layers3, Package, Palette, Printer, Shirt, ShoppingBag, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  ["Design Editor", Palette],
  ["3D Mockup Studio", Box],
  ["Bulk Event Order", Users],
  ["3D Printing Custom", Printer],
  ["Product Knowledge AI", Bot],
  ["Vendor Production Dashboard", Factory]
];

const categories = [
  ["Clothing", Shirt],
  ["Merchandise", ShoppingBag],
  ["Packaging", Package],
  ["Event Kit", Users],
  ["F&B Branding", Sparkles],
  ["3D Printing", Layers3]
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative min-h-[92vh] overflow-hidden bg-[#1a1a2e] px-5 py-6 text-white">
        <Image src="/reference/banner_hero_futuristic.jpg" alt="Desain tanpa batas" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#321553]/78 to-[#005b91]/42" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-soft backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Image src="/reference/logo_kreasi_modern.png" alt="MerchDesign Studio" width={132} height={48} className="h-10 w-auto brightness-0 invert" />
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-white/78 md:flex">
            <Link href="/products">Katalog</Link>
            <Link href="/mockup-studio">Mockup</Link>
            <Link href="/bulk-order">Bulk Order</Link>
            <Link href="/admin">Admin</Link>
          </div>
          <Button asChild size="sm" variant="outline"><Link href="/login" className="text-slate-950">Masuk</Link></Button>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Badge className="mb-5 border-white/20 bg-white/10 text-white">DESAIN TANPA BATAS</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              Desain Merchandise, Clothing, Packaging, dan Produk 3D Custom dalam Satu Platform
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78">
              Buat desain seperti Canva, preview ke mockup 3D, hitung harga otomatis, dan produksi untuk kebutuhan event, UMKM, clothing brand, serta corporate merchandise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/editor">Mulai Desain Gratis <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/products" className="text-slate-950">Lihat Katalog Produk</Link></Button>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] border-white/20 bg-white/12 p-4">
            <div className="rounded-[1.5rem] border border-white/15 bg-[#100e2f]/82 p-4 text-white">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold">Mockup Studio</p>
                <Badge className="border-white/20 bg-white/10 text-white">Live Quote</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
                <div className="grid min-h-80 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-white to-amber-200">
                  <div className="rounded-3xl bg-white/92 px-10 py-14 text-center text-slate-950 shadow-soft">
                    <Shirt className="mx-auto h-24 w-24" />
                    <p className="mt-4 text-2xl font-semibold">Event Shirt</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["DTF full color", "MOQ 200 pcs", "Produksi 7 hari", "Estimasi Rp 13,8 jt"].map((item) => (
                    <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Workflow produksi lengkap</h2>
              <p className="mt-2 text-muted-foreground">Dari desain, validasi file, quotation, sampai vendor production board.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([name, Icon]) => (
              <Card key={name as string} className="border-white/70 bg-white/88">
                <CardContent className="p-6">
                  <div className="brand-gradient mb-5 grid h-12 w-12 place-items-center rounded-full text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{name as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Modul siap dikembangkan dengan data produk, rules harga, dan workflow approval produksi.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold">Kategori produk</h2>
            <p className="mt-3 text-muted-foreground">Clothing, merchandise, packaging UMKM, event kit, F&B branding, dan custom 3D printing.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(([name, Icon]) => (
              <Link href="/products" key={name as string} className="rounded-[1.4rem] border border-white/70 bg-white/85 p-5 shadow-panel transition hover:-translate-y-1">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#6c63ff] via-[#ff6584] to-[#00d4aa] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-semibold">{name as string}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
          <h2 className="text-3xl font-semibold">Cara kerja</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {["Pilih produk", "Buat/upload desain", "Preview mockup", "Hitung harga", "Order produksi", "Tracking pesanan"].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/10 p-4">
                <p className="text-3xl font-semibold text-cyan-300">{index + 1}</p>
                <p className="mt-3 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/70 px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>MerchDesign Studio - MVP production-ready scaffold.</p>
          <div className="flex gap-4">
            <Link href="/products">Katalog</Link>
            <Link href="/register">Register</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
