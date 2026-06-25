# Deployment

Local:
1. `npm install`
2. salin `.env.example` ke `.env.local`
3. isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` jika memakai Supabase
4. `npm run dev`
5. buka `http://localhost:3000`

Supabase:
1. Buat project Supabase.
2. Jalankan `database/schema.sql` di SQL editor.
3. Jalankan `database/seed.sql`.
4. Buat bucket storage: `user-uploads`, `design-previews`, `mockup-exports`, `product-images`, `product-models`, `production-files`, `brand-assets`, `quotation-pdfs`.
5. Konfigurasi redirect auth ke domain Vercel.

Vercel:
1. Import repository.
2. Set environment variables.
3. Deploy dengan build command `npm run build`.
