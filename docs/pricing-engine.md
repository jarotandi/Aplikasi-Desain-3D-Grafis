# Pricing Engine

File utama:
- `lib/pricing/types.ts`
- `lib/pricing/rules.ts`
- `lib/pricing/pricing-engine.ts`

Input menghitung product, variant, quantity, print method, jumlah area cetak, complexity, deadline, finishing, packaging, vendor cost, margin, material gram, print time, dan failure risk.

Rules MVP:
- qty >= 50: diskon 10%
- qty >= 100: diskon 15%
- deadline lebih cepat dari normal production time: rush fee 20%
- full color menambah print fee
- sablon manual memakai setup fee
- 3D printing menghitung material gram, print time, failure risk, dan margin

Endpoint:
- `POST /api/pricing`
- `GET /api/quotations` untuk dummy quotation
