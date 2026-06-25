import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MerchDesign Studio",
  description: "Platform desain merchandise, mockup, quotation, dan produksi custom."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
