export type UserRole = "guest" | "customer" | "vendor" | "admin";

export type ProductCategory =
  | "Clothing"
  | "Merchandise"
  | "Packaging"
  | "Event Kit"
  | "F&B Branding"
  | "3D Printing";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  startingPrice: number;
  moq: number;
  productionTime: string;
  has2DMockup: boolean;
  has3DMockup: boolean;
  imageUrl: string;
  materials: string[];
  sizes: string[];
  colors: string[];
  printMethods: string[];
};

export type ProductKnowledge = {
  productId: string;
  designAreas: string[];
  safeZone: string;
  bleed: string;
  maxPrintSize: string;
  fileRequirements: string[];
  pricingRules: string[];
  productionConstraints: string[];
  recommendedUseCases: string[];
  warnings: string[];
  faq: { question: string; answer: string }[];
  aiContext: string;
};

export type OrderStatus =
  | "draft"
  | "quotation_requested"
  | "waiting_payment"
  | "paid_dp"
  | "design_review"
  | "waiting_approval"
  | "approved_for_production"
  | "assigned_to_vendor"
  | "in_production"
  | "quality_check"
  | "packing"
  | "shipped"
  | "completed"
  | "cancelled";
