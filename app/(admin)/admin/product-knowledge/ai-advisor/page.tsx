import { ProductAdvisorWorkbench } from "@/components/ai/product-advisor-workbench";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminAIAdvisorPage() {
  return (
    <AppShell role="admin" title="AI Product Advisor" description="Rule-based assistant berbasis product knowledge, siap diganti OpenAI API.">
      <ProductAdvisorWorkbench />
    </AppShell>
  );
}
