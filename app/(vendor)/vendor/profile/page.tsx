import { AppShell } from "@/components/layout/app-shell";
import { VendorProfileSettings } from "@/components/vendor/vendor-profile-settings";

export default function VendorProfilePage() {
  return (
    <AppShell role="vendor" title="Vendor Profile" description="Company name, production types, location, capacity, price list, dan contact.">
      <VendorProfileSettings />
    </AppShell>
  );
}
