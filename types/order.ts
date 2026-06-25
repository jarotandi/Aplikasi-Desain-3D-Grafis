export type StudioQuotationStatus = "draft" | "customer_review" | "approved" | "production" | "quality_check" | "shipped" | "completed" | "cancelled";

export interface OrderQuotation {
  id: string;
  projectId: string;
  customerId?: string;
  products: Array<{
    productType: string;
    materialId: string;
    printArea: string;
    size: string;
    quantity: number;
    productionMethod: string;
    finishing?: string;
  }>;
  quantity: number;
  materialCost: number;
  productionCost: number;
  designCost: number;
  vendorCost: number;
  margin: number;
  tax: number;
  totalPrice: number;
  status: StudioQuotationStatus;
  createdAt: string;
  updatedAt: string;
}
