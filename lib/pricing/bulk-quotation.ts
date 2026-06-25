import type { BulkEventInfo, BulkQuotationRecord, BulkSelectedProduct, EventPackageId, SizeBreakdown } from "@/lib/bulk-order/types";
import { getKnowledgeByProductId, products } from "@/lib/data/products";
import { calculatePrice } from "@/lib/pricing/pricing-engine";

function daysBetween(startDate: Date, endDate: Date) {
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function createQuotationNumber() {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `QTN-MDS-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function buildBulkQuotation(input: {
  userId: string;
  bulkOrderId: string;
  eventInfo: BulkEventInfo;
  selectedPackage: EventPackageId;
  selectedProducts: BulkSelectedProduct[];
  sizeBreakdown: SizeBreakdown;
}): BulkQuotationRecord {
  const now = new Date();
  const deadline = input.eventInfo.deadline ? new Date(input.eventInfo.deadline) : addDays(now, 14);
  const deadlineDays = daysBetween(now, deadline);

  const items = input.selectedProducts.map((selected) => {
    const product = products.find((item) => item.id === selected.productId) ?? products[0];
    const knowledge = getKnowledgeByProductId(product.id);
    const normalProductionDays = product.productionTime.includes("-") ? Number(product.productionTime.split("-")[1]?.replace(/\D/g, "")) || product.productionTime.length : 7;
    const is3D = product.category === "3D Printing";
    const pricing = calculatePrice({
      productId: product.id,
      quantity: Math.max(selected.quantity, product.moq),
      basePrice: product.startingPrice,
      printMethod: selected.printMethod,
      printAreaCount: selected.printAreaCount,
      designComplexity: selected.designComplexity,
      deadlineDays,
      normalProductionDays,
      finishing: product.category === "Packaging" ? selected.quantity * 750 : is3D ? selected.quantity * 5000 : 0,
      packaging: selected.quantity * (product.category === "Clothing" ? 1200 : 600),
      margin: product.category === "3D Printing" ? 0.24 : 0.18,
      materialGram: is3D ? selected.quantity * 38 : undefined,
      printTimeHour: is3D ? selected.quantity * 1.2 : undefined,
      failureRiskPercentage: is3D ? 10 : undefined
    });

    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: Math.max(selected.quantity, product.moq),
      unitPrice: product.startingPrice,
      printMethod: selected.printMethod,
      productionTime: product.productionTime,
      pricing,
      warnings: knowledge?.warnings ?? []
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.pricing.subtotal, 0);
  const discount = items.reduce((sum, item) => sum + item.pricing.discount, 0);
  const rushFee = items.reduce((sum, item) => sum + item.pricing.rushFee, 0);
  const setupFee = items.reduce((sum, item) => sum + item.pricing.setupFee, 0);
  const printFee = items.reduce((sum, item) => sum + item.pricing.printFee, 0);
  const finishingFee = items.reduce((sum, item) => sum + item.pricing.finishingFee, 0);
  const margin = items.reduce((sum, item) => sum + item.pricing.margin, 0);
  const designFee = input.selectedPackage === "premium" ? 750_000 : input.selectedPackage === "custom" ? 500_000 : 250_000;
  const shippingFee = input.eventInfo.participantCount >= 200 ? 450_000 : 250_000;
  const tax = (subtotal + margin + designFee + shippingFee) * 0.11;
  const total = subtotal + margin + designFee + shippingFee + tax;
  const maxProduction = Math.max(...items.map((item) => Number(item.productionTime.split("-")[1]?.replace(/\D/g, "")) || 7), 7);

  return {
    id: `quotation-${Date.now()}`,
    user_id: input.userId,
    bulk_event_order_id: input.bulkOrderId,
    quotation_number: createQuotationNumber(),
    event_info: input.eventInfo,
    selected_package: input.selectedPackage,
    items,
    size_breakdown: input.sizeBreakdown,
    subtotal,
    discount,
    rush_fee: rushFee,
    design_fee: designFee,
    setup_fee: setupFee,
    print_fee: printFee,
    finishing_fee: finishingFee,
    shipping_fee: shippingFee,
    tax,
    margin,
    total,
    dp_amount: total * 0.5,
    remaining_amount: total * 0.5,
    terms: "DP 50%, pelunasan sebelum pengiriman, desain dikunci setelah approval.",
    valid_until: dateOnly(addDays(now, 7)),
    status: "waiting_admin_review",
    production_timeline: {
      designReviewDays: 2,
      productionDaysMin: Math.max(3, maxProduction - 3),
      productionDaysMax: maxProduction,
      qcDays: 1,
      estimatedReadyDate: dateOnly(addDays(now, 2 + maxProduction + 1))
    },
    notes: Array.from(new Set(items.flatMap((item) => [...item.pricing.notes, ...item.warnings]))),
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };
}
