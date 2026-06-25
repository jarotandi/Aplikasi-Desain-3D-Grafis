import type { StudioProject } from "@/types/studio3d";

export async function saveStudioProject(project: StudioProject) {
  return { data: project, error: null, mode: "local-placeholder" };
}

export async function loadStudioProject(id: string) {
  return { data: null as StudioProject | null, error: null, id, mode: "supabase-placeholder" };
}
