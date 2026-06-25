import { defaultMaterials } from "@/data/defaultMaterials";

export async function listStudioMaterials() {
  return { data: defaultMaterials, error: null, mode: "default-local-placeholder" };
}
