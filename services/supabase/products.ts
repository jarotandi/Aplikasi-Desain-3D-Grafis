import { defaultProducts } from "@/data/defaultProducts";

export async function listStudioProductModels() {
  return { data: defaultProducts, error: null, mode: "default-local-placeholder" };
}
