import type { BulkSelectedProduct, EventPackageId } from "@/lib/bulk-order/types";
import { products } from "@/lib/data/products";

const bySlug = (slug: string) => products.find((product) => product.slug === slug);

export const eventPackages: Record<EventPackageId, { name: string; description: string; productSlugs: string[] }> = {
  basic: {
    name: "Basic Package",
    description: "T-shirt, ID card, dan lanyard untuk event efisien.",
    productSlugs: ["t-shirt-cotton-combed-24s", "id-card-pvc", "lanyard-custom"]
  },
  standard: {
    name: "Standard Package",
    description: "T-shirt, tote bag, sticker, ID card, dan lanyard.",
    productSlugs: ["t-shirt-cotton-combed-24s", "tote-bag-canvas", "sticker-vinyl", "id-card-pvc", "lanyard-custom"]
  },
  premium: {
    name: "Premium Package",
    description: "Paket premium dengan hoodie, tumbler, tote bag, trophy, backdrop.",
    productSlugs: ["hoodie-fleece", "tumbler-stainless", "tote-bag-canvas", "trophy-3d-print", "backdrop-event"]
  },
  custom: {
    name: "Custom Package",
    description: "Pilih kombinasi produk sendiri.",
    productSlugs: ["t-shirt-cotton-combed-24s", "tote-bag-canvas", "sticker-vinyl"]
  }
};

export function buildPackageProducts(packageId: EventPackageId, participantCount: number): BulkSelectedProduct[] {
  const packageConfig = eventPackages[packageId];
  return packageConfig.productSlugs
    .map((slug) => bySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => {
      const isBackdrop = product.slug.includes("backdrop");
      const isTrophy = product.slug.includes("trophy");
      return {
        productId: product.id,
        quantity: isBackdrop ? 1 : isTrophy ? Math.max(3, Math.ceil(participantCount * 0.03)) : Math.max(participantCount, product.moq),
        printMethod: product.printMethods[0] ?? "Digital Print",
        printAreaCount: product.category === "Clothing" ? 1 : 1,
        designComplexity: product.category === "3D Printing" ? "complex" : "full_color"
      };
    });
}
