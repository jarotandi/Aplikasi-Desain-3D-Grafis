# Product Knowledge

Product knowledge adalah sumber konteks untuk pricing, validasi desain, rekomendasi AI, dan instruksi produksi.

Field penting:
- material, variants, colors, sizes
- MOQ dan production time
- print methods
- design areas, safe zone, bleed, max print size
- file requirements
- pricing notes dan production constraints
- recommended use cases
- design warnings
- vendor capabilities
- `ai_context` untuk prompt/context AI provider

Untuk MVP, data tersedia di `lib/data/products.ts` dan seed SQL. Saat Supabase aktif, halaman admin product knowledge dapat diganti memakai query ke table `product_knowledge`.
