import Image from "next/image";
import Link from "next/link";
import { BarChart3, Box, Boxes, FileText, Folder, ImageIcon, LayoutTemplate, Palette, Presentation, Shirt, ShoppingCart, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const templateCategories = [
  { title: "Social Media", icon: ImageIcon, color: "from-sky-300 to-blue-400" },
  { title: "Logo", icon: Palette, color: "from-emerald-300 to-teal-400" },
  { title: "Poster", icon: LayoutTemplate, color: "from-orange-300 to-pink-400" },
  { title: "Merchandise", icon: Shirt, color: "from-violet-300 to-purple-500" },
  { title: "3D Studio", icon: Boxes, color: "from-cyan-300 to-blue-500" },
  { title: "Analytics", icon: BarChart3, color: "from-amber-300 to-orange-400" },
  { title: "Packaging", icon: Box, color: "from-cyan-300 to-teal-400" },
  { title: "Event Kit", icon: Users, color: "from-pink-300 to-rose-400" },
  { title: "Presentation", icon: Presentation, color: "from-indigo-300 to-blue-500" }
];

const recentDesigns = [
  { title: "Flyer", image: "/reference/poster_promosi.jpg" },
  { title: "Social Post", image: "/reference/template_sosmed_set.jpg" },
  { title: "Logo Draft", image: "/reference/logo_kreasi_modern.png" },
  { title: "Website Mockup", image: "/reference/mockup_dashboard_light.jpg" }
];

export default function DashboardPage() {
  return (
    <AppShell title="Customer Dashboard" description="Kelola template, project desain, mockup, quotation, dan produksi.">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#6c63ff]">KREASI style workspace</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#1a1a2e]">Buat desain produksi dari satu canvas</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Mulai dari template social media, logo, poster, merchandise, packaging, sampai mockup produk fisik.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/editor" className="brand-gradient rounded-full px-7 py-4 text-sm font-bold text-white shadow-[0_20px_45px_rgb(108_99_255_/_0.26)]">
                  Create New Design
                </Link>
                <Link href="/studio/3d" className="rounded-full bg-[#1a1a2e] px-7 py-4 text-sm font-bold text-white shadow-[0_20px_45px_rgb(26_26_46_/_0.18)]">
                  Open 3D Studio
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {templateCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  href={category.title === "Merchandise" ? "/products" : category.title === "3D Studio" ? "/studio/3d" : "/editor"}
                  key={category.title}
                  className="group rounded-[1.6rem] border border-white/70 bg-white/86 p-4 shadow-soft transition hover:-translate-y-1"
                >
                  <div className={`mb-4 grid h-28 place-items-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-panel`}>
                    <Icon className="h-12 w-12 transition group-hover:scale-110" />
                  </div>
                  <p className="text-center font-semibold text-[#1a1a2e]">{category.title}</p>
                </Link>
              );
            })}
          </section>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Project aktif", "12", Folder],
              ["Order berjalan", "4", ShoppingCart],
              ["Quotation pending", "3", FileText]
            ].map(([label, value, Icon]) => (
              <Card key={label as string}>
                <CardContent className="p-5">
                  <div className="brand-gradient mb-4 grid h-12 w-12 place-items-center rounded-full text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">{label as string}</p>
                  <p className="mt-1 text-3xl font-semibold">{value as string}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Designs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {recentDesigns.map((item) => (
                <Link href="/editor" key={item.title} className="text-center">
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-panel">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="160px" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">{item.title}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="brand-gradient p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/75">Upgrade to Pro</p>
                <h3 className="mt-2 text-2xl font-semibold">Template premium dan export production-ready</h3>
                <p className="mt-3 text-sm leading-6 text-white/78">Aktifkan asset brand, mockup 3D, quotation PDF, dan vendor workflow.</p>
              </div>
              <div className="p-5">
                <Link href="/products" className="block rounded-2xl bg-[#1a1a2e] px-5 py-3 text-center text-sm font-semibold text-white">
                  Lihat Paket Produksi
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[62%] rounded-full bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#00d4aa]" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">6.2 GB dari 10 GB digunakan.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
