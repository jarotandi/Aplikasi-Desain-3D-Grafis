import { AppShell } from "@/components/layout/app-shell";
import { ProductKnowledgeManager } from "@/components/admin/product-knowledge-manager";

export default function AdminProductKnowledgePage() {
  return (
    <AppShell role="admin" title="Product Knowledge" description="List, create, edit, delete, import/export JSON, dan attach knowledge ke produk.">
      <ProductKnowledgeManager />
    </AppShell>
  );
}
