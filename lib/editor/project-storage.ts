export type DesignProjectRecord = {
  id: string;
  user_id: string;
  product_id: string | null;
  name: string;
  canvas_json: unknown;
  preview_url: string | null;
  width: number;
  height: number;
  unit: "px" | "mm" | "cm";
  status: "draft" | "ready_for_mockup" | "archived";
  created_at: string;
  updated_at: string;
};

const STORAGE_KEY = "merchdesign-design-projects";
const ACTIVE_PROJECT_KEY = "merchdesign-active-project-id";

function readProjects(): DesignProjectRecord[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DesignProjectRecord[];
  } catch {
    return [];
  }
}

function writeProjects(projects: DesignProjectRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getActiveProjectId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveProjectId(id: string) {
  window.localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

export function loadDesignProject(id?: string | null) {
  const projects = readProjects();
  const activeId = id ?? getActiveProjectId();
  return projects.find((project) => project.id === activeId) ?? projects[0] ?? null;
}

export function saveDesignProject(input: Omit<DesignProjectRecord, "created_at" | "updated_at"> & { created_at?: string }) {
  const projects = readProjects();
  const existing = projects.find((project) => project.id === input.id);
  const now = new Date().toISOString();
  const record: DesignProjectRecord = {
    ...input,
    created_at: input.created_at ?? existing?.created_at ?? now,
    updated_at: now
  };
  const nextProjects = existing ? projects.map((project) => (project.id === record.id ? record : project)) : [record, ...projects];
  writeProjects(nextProjects);
  setActiveProjectId(record.id);
  return record;
}

export function listDesignProjects() {
  return readProjects();
}
