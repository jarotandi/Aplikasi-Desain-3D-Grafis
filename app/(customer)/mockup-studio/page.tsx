import { AppShell } from "@/components/layout/app-shell";
import { MockupStudio } from "@/components/mockup/mockup-studio";

export default function MockupStudioPage() {
  return (
    <AppShell title="Mockup Studio" description="Tempel desain ke produk, adjust posisi, ganti warna, dan export mockup.">
      <MockupStudio />
    </AppShell>
  );
}
