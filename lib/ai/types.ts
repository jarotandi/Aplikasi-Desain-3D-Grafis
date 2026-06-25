export type AIIntent =
  | "event_recommendation"
  | "print_method"
  | "design_warning"
  | "budget_estimation"
  | "alternative_product"
  | "3d_printing"
  | "packaging"
  | "general";

export type AIInput = {
  message: string;
  context?: string;
  productId?: string;
};

export type AIResponse = {
  message: string;
  confidence: number;
  intent: AIIntent;
  sources: string[];
  recommendations?: {
    productIds?: string[];
    printMethods?: string[];
    warnings?: string[];
    estimatedBudget?: number;
  };
};

export interface AIProvider {
  generateResponse(input: AIInput): Promise<AIResponse>;
}
