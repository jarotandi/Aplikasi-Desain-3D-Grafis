# MerchDesign Studio Architecture

MerchDesign Studio memakai Next.js App Router sebagai full-stack boundary: UI, server routes, pricing endpoint, upload endpoint placeholder, dan integrasi Supabase.

Lapisan utama:
- `app/`: route public, auth, customer, admin, vendor, dan API.
- `components/`: komponen reusable untuk layout, product, editor, mockup, bulk order, AI.
- `lib/data`: dummy data agar MVP berjalan tanpa Supabase.
- `lib/pricing`: pricing engine berbasis rules.
- `lib/ai`: AI provider abstraction dan rule-based implementation.
- `database`: schema dan seed Supabase PostgreSQL.

Auth dirancang memakai Supabase Auth dengan table `users_profile.role`. Redirect role:
- customer: `/dashboard`
- vendor: `/vendor`
- admin: `/admin`

Storage bucket yang disiapkan: `user-uploads`, `design-previews`, `mockup-exports`, `product-images`, `product-models`, `production-files`, `brand-assets`, `quotation-pdfs`.
