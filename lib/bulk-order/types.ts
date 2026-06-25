import type { PricingOutput } from "@/lib/pricing/types";

export type EventType =
  | "Seminar"
  | "Corporate Gathering"
  | "Sports Event"
  | "Wedding"
  | "Product Launching"
  | "Community Event"
  | "Restaurant/Cafe Launching"
  | "Campus Event";

export type EventPackageId = "basic" | "standard" | "premium" | "custom";

export type BulkEventInfo = {
  eventType: EventType;
  eventName: string;
  eventDate: string;
  location: string;
  deadline: string;
  participantCount: number;
  budgetMin: number;
  budgetMax: number;
};

export type SizeBreakdown = {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  custom: number;
};

export type BulkSelectedProduct = {
  productId: string;
  quantity: number;
  printMethod: string;
  printAreaCount: number;
  designComplexity: "simple" | "standard" | "complex" | "full_color";
};

export type BulkAsset = {
  id: string;
  label: string;
  fileName: string;
  fileType: string;
};

export type BulkEventOrderRecord = {
  id: string;
  user_id: string;
  event_info: BulkEventInfo;
  selected_package: EventPackageId;
  selected_products: BulkSelectedProduct[];
  size_breakdown: SizeBreakdown;
  uploaded_assets: BulkAsset[];
  status: "draft" | "waiting_admin_review" | "quoted" | "approved" | "rejected" | "production" | "shipped" | "completed";
  created_at: string;
  updated_at: string;
};

export type QuotationItem = {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  printMethod: string;
  productionTime: string;
  pricing: PricingOutput;
  warnings: string[];
};

export type BulkQuotationRecord = {
  id: string;
  user_id: string;
  bulk_event_order_id: string;
  quotation_number: string;
  event_info: BulkEventInfo;
  selected_package: EventPackageId;
  items: QuotationItem[];
  size_breakdown: SizeBreakdown;
  subtotal: number;
  discount: number;
  rush_fee: number;
  design_fee: number;
  setup_fee: number;
  print_fee: number;
  finishing_fee: number;
  shipping_fee: number;
  tax: number;
  margin: number;
  total: number;
  dp_amount: number;
  remaining_amount: number;
  terms: string;
  valid_until: string;
  status: "draft" | "waiting_admin_review" | "sent" | "approved" | "rejected" | "expired";
  production_timeline: {
    designReviewDays: number;
    productionDaysMin: number;
    productionDaysMax: number;
    qcDays: number;
    estimatedReadyDate: string;
  };
  notes: string[];
  created_at: string;
  updated_at: string;
};
