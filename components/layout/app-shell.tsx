import Image from "next/image";
import Link from "next/link";
import { Bell, Box, Boxes, ChevronRight, Factory, FileText, Home, LayoutDashboard, Package, Palette, Search, Settings, ShoppingCart, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const customerNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/editor", label: "Design Editor", icon: Palette },
  { href: "/studio/3d", label: "3D Modeling Studio", icon: Boxes },
  { href: "/mockup-studio", label: "Mockup Studio", icon: Box },
  { href: "/products", label: "Product Catalog", icon: Package },
  { href: "/bulk-order", label: "Bulk Event Order", icon: Users },
  { href: "/quotations", label: "Quotation", icon: FileText },
  { href: "/orders", label: "My Orders", icon: ShoppingCart },
  { href: "/brand-kit", label: "Brand Kit", icon: Sparkles }
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/product-knowledge", label: "Product Knowledge", icon: Sparkles },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/quotations", label: "Quotations", icon: FileText },
  { href: "/admin/vendors", label: "Vendors", icon: Factory },
  { href: "/admin/production", label: "Production Board", icon: Settings },
  { href: "/admin/analytics", label: "Analytics", icon: LayoutDashboard }
];

const vendorNav: NavItem[] = [
  { href: "/vendor", label: "Overview", icon: LayoutDashboard },
  { href: "/vendor/orders", label: "Assigned Orders", icon: ShoppingCart },
  { href: "/vendor/profile", label: "Vendor Profile", icon: Factory }
];

export function AppShell({
  children,
  title,
  description,
  role = "customer"
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  role?: "customer" | "admin" | "vendor";
}) {
  const nav = role === "admin" ? adminNav : role === "vendor" ? vendorNav : customerNav;
  const iconColors = ["from-pink-300 to-rose-400", "from-cyan-300 to-blue-400", "from-violet-300 to-purple-500", "from-teal-300 to-emerald-400", "from-amber-300 to-orange-400"];

  return (
    <div className="min-h-screen bg-[#eef2f7]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/76 p-5 shadow-[18px_0_60px_rgb(26_26_46_/_0.06)] backdrop-blur-2xl lg:block">
        <Link href="/" className="mb-9 flex items-center rounded-[1.4rem] bg-white/80 p-3 shadow-panel">
          <Image src="/reference/logo_kreasi_modern.png" alt="MerchDesign Studio" width={126} height={48} className="h-11 w-auto object-contain" />
        </Link>
        <nav className="space-y-2">
          {nav.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-[#1a1a2e] hover:shadow-panel")}
              >
                <span className="flex items-center gap-3">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br text-white shadow-sm", iconColors[index % iconColors.length])}>
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-white/70 px-5 py-4 backdrop-blur-2xl lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Home className="h-3.5 w-3.5" />
                MerchDesign Workspace
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="hidden h-12 min-w-80 items-center gap-3 rounded-2xl border bg-white/85 px-4 text-sm text-slate-400 shadow-sm md:flex">
                <Search className="h-4 w-4" />
                Cari project, produk, quotation...
              </div>
              <button className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-500 shadow-sm" aria-label="Notifikasi">
                <Bell className="h-5 w-5" />
              </button>
              <Link href="/products" className="brand-gradient rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-panel">
                Create New Design
              </Link>
            </div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
