import type { OrderStatus } from "@/types";

export const orderStatuses: OrderStatus[] = [
  "draft",
  "quotation_requested",
  "waiting_payment",
  "paid_dp",
  "design_review",
  "waiting_approval",
  "approved_for_production",
  "assigned_to_vendor",
  "in_production",
  "quality_check",
  "packing",
  "shipped",
  "completed",
  "cancelled"
];

export const productionBoardStatuses: OrderStatus[] = [
  "waiting_approval",
  "approved_for_production",
  "assigned_to_vendor",
  "in_production",
  "quality_check",
  "packing",
  "shipped",
  "completed"
];

export type ProductionOrderItem = {
  productName: string;
  category: string;
  quantity: number;
  specs: string;
};

export type ProductionFile = {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
};

export type ProductionOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  quotationNumber: string;
  orderType: "single_product" | "design_project" | "bulk_event" | "3d_printing" | "quotation_based";
  status: OrderStatus;
  totalAmount: number;
  paymentStatus: "unpaid" | "dp_paid" | "paid";
  dpAmount: number;
  remainingAmount: number;
  productionDeadline: string;
  shippingAddress: string;
  notes: string;
  items: ProductionOrderItem[];
  files: ProductionFile[];
  assignedVendorId?: string;
  createdAt: string;
  updatedAt: string;
};

export type VendorRecord = {
  id: string;
  userId: string;
  companyName: string;
  location: string;
  contactPhone: string;
  productionMethods: string[];
  capabilities: string[];
  capacityPerDay: Record<string, number>;
  priceList: Record<string, number>;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type ProductionUpdate = {
  id: string;
  orderId: string;
  vendorId?: string;
  status: OrderStatus;
  note: string;
  proofUrl?: string;
  createdBy: "admin" | "vendor";
  createdAt: string;
};
