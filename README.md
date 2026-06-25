# MerchDesign Studio

MerchDesign Studio adalah platform desain online untuk merchandise, clothing, packaging UMKM, event kit, mockup 2D/3D, quotation, dan production dashboard.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style components
- lucide-react icons
- Supabase Auth, PostgreSQL, Storage
- Pricing engine rule-based
- AI assistant abstraction dengan LocalRuleBasedAIProvider
- Placeholder untuk Fabric.js/Konva editor, React Three Fiber mockup, Midtrans/Xendit

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Route utama

- `/` landing page
- `/products` product catalog
- `/products/[slug]` product detail + product knowledge
- `/login`, `/register` auth UI
- `/dashboard` customer dashboard
- `/editor` design editor MVP
- `/mockup-studio` mockup studio MVP
- `/3d-printing` 3D printing customizer
- `/bulk-order` wizard bulk event order
- `/quotations`, `/orders`, `/brand-kit`
- `/admin` admin dashboard
- `/admin/products`, `/admin/product-knowledge`, `/admin/orders`, `/admin/quotations`, `/admin/vendors`, `/admin/production`, `/admin/analytics`
- `/vendor`, `/vendor/orders`, `/vendor/profile`

## Database

SQL ada di:

- `database/schema.sql`
- `database/seed.sql`

RLS MVP sudah disiapkan:
- customer melihat data miliknya
- vendor melihat assignment miliknya
- admin melihat semua melalui helper `is_admin()`

## Environment

Salin `.env.example` menjadi `.env.local`, lalu isi Supabase keys.

## Status MVP

Project ini adalah scaffold production-ready untuk Phase 1 sampai struktur Phase 8. Data masih memakai dummy local agar aplikasi bisa berjalan tanpa Supabase. Endpoint pricing dan quotation sudah tersedia sebagai dasar integrasi backend.
