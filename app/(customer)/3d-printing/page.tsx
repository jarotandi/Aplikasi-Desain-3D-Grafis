import { AppShell } from "@/components/layout/app-shell";
import { PrintingCustomizer } from "@/components/three-d-printing/printing-customizer";

export default function ThreeDPrintingPage() {
  return (
    <AppShell title="3D Printing Customizer" description="Buat keychain, logo stand, name plate, trophy, plaque, dan custom ornament.">
      <PrintingCustomizer />
    </AppShell>
  );
}
