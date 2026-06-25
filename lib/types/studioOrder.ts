import type { ProductMockupType, SceneState } from "@/lib/types/studio";

export type StudioOrderStatus = "draft" | "waiting_quotation" | "quoted" | "approved" | "production" | "shipped" | "completed";

export interface StudioSizeBreakdown {
  [size: string]: number;
}

export interface StudioQuotationRequest {
  id: string;
  quotationNumber: string;
  projectId: string;
  projectName: string;
  product: ProductMockupType | string;
  quantity: number;
  sizeBreakdown: StudioSizeBreakdown;
  material: string;
  printMethod: string;
  deadline: string;
  customerNote: string;
  status: StudioOrderStatus;
  sceneSnapshot: SceneState;
  createdAt: string;
  updatedAt: string;
}
