"use client";

import { create } from "zustand";
import type {
  MaterialSettings,
  ModifierType,
  ObjectType,
  PrintableAreaId,
  ProductMockupType,
  RenderJob,
  SceneState,
  StudioObject,
  ToolType,
  Transform,
  TransformMode,
  ViewportSettings
} from "@/lib/types/studio";
import { createStudioObject } from "@/lib/three/createPrimitive";
import { createId } from "@/lib/utils/id";
import { getProductTemplate } from "@/lib/data/productTemplates";

const STORAGE_KEY = "3d-product-studio-project";

type StudioSnapshot = Pick<SceneState, "objects" | "selectedObjectId" | "selectedObjectIds" | "viewportSettings">;

interface StudioStore extends SceneState {
  activeTool: ToolType;
  transformMode: TransformMode;
  history: StudioSnapshot[];
  future: StudioSnapshot[];
  renderJobs: RenderJob[];
  addObject: (type: ObjectType, overrides?: Partial<StudioObject>) => string;
  updateObject: (id: string, patch: Partial<StudioObject>, recordHistory?: boolean) => void;
  deleteObject: (id: string) => void;
  selectObject: (id?: string, additive?: boolean) => void;
  duplicateObject: (id: string) => void;
  duplicateSelected: () => void;
  groupSelected: () => void;
  ungroupObject: (id: string) => void;
  snapSelectedToGrid: (gridSize?: number) => void;
  alignSelected: (axis: "x" | "z", mode: "min" | "center" | "max") => void;
  renameObject: (id: string, name: string) => void;
  setMaterial: (id: string, material: Partial<MaterialSettings>) => void;
  setTransform: (id: string, transform: Partial<Transform>, recordHistory?: boolean) => void;
  addModifier: (id: string, type: ModifierType) => void;
  toggleModifier: (objectId: string, modifierId: string) => void;
  applyModifier: (objectId: string, modifierId: string) => void;
  deleteModifier: (objectId: string, modifierId: string) => void;
  addProductTemplate: (templateId: ProductMockupType) => string | undefined;
  addDecalToPrintableArea: (templateId: ProductMockupType, areaId: PrintableAreaId, imageUrl: string, name?: string) => string | undefined;
  setActiveTool: (tool: ToolType) => void;
  setTransformMode: (mode: TransformMode) => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  loadProject: () => void;
  importModel: (object: StudioObject) => void;
  requestRender: () => Promise<RenderJob>;
  pollRenderJob: (id: string) => Promise<void>;
  updateRenderJob: (id: string, patch: Partial<RenderJob>) => void;
  updateViewportSettings: (settings: Partial<ViewportSettings>) => void;
  resetProject: () => void;
}

const defaultViewportSettings: ViewportSettings = {
  grid: true,
  ambientIntensity: 0.75,
  directionalIntensity: 1.35,
  background: "#0f172a"
};

function snapshot(state: StudioStore): StudioSnapshot {
  return {
    objects: structuredClone(state.objects),
    selectedObjectId: state.selectedObjectId,
    selectedObjectIds: [...state.selectedObjectIds],
    viewportSettings: structuredClone(state.viewportSettings)
  };
}

function withHistory(state: StudioStore) {
  return {
    history: [...state.history.slice(-39), snapshot(state)],
    future: []
  };
}

function touchObject(object: StudioObject, patch: Partial<StudioObject>): StudioObject {
  return {
    ...object,
    ...patch,
    transform: patch.transform ? { ...object.transform, ...patch.transform } : object.transform,
    material: patch.material ? { ...object.material, ...patch.material } : object.material,
    updatedAt: new Date().toISOString()
  };
}

function normalizeObject(object: StudioObject): StudioObject {
  return {
    ...object,
    modifiers: object.modifiers ?? [],
    childIds: object.childIds ?? [],
    visible: object.visible ?? true,
    locked: object.locked ?? false
  };
}

const initialObjects = [
  createStudioObject("cube", {
    name: "Hero Product Block",
    transform: { position: [0, 0.55, 0], rotation: [0, 0, 0], scale: [1.6, 1.1, 1.6] },
    material: { color: "#38bdf8", roughness: 0.42, metalness: 0.08, opacity: 1 }
  })
];

export const useStudioStore = create<StudioStore>((set, get) => ({
  projectId: createId("project"),
  projectName: "Untitled 3D Product",
  objects: initialObjects,
  selectedObjectId: initialObjects[0]?.id,
  selectedObjectIds: initialObjects[0]?.id ? [initialObjects[0].id] : [],
  activeTool: "select",
  transformMode: "translate",
  history: [],
  future: [],
  renderJobs: [],
  viewportSettings: defaultViewportSettings,

  addObject: (type, overrides) => {
    const object = createStudioObject(type, overrides);
    set((state) => ({
      ...withHistory(state),
      objects: [...state.objects, object],
      selectedObjectId: object.id,
      selectedObjectIds: [object.id]
    }));
    return object.id;
  },

  updateObject: (id, patch, recordHistory = true) => {
    set((state) => ({
      ...(recordHistory ? withHistory(state) : {}),
      objects: state.objects.map((object) => {
        if (object.id === id) return touchObject(object, patch);
        if (object.parentId === id && "visible" in patch) return touchObject(object, { visible: patch.visible });
        if (object.parentId === id && "locked" in patch) return touchObject(object, { locked: patch.locked });
        return object;
      })
    }));
  },

  deleteObject: (id) => {
    set((state) => ({
      ...withHistory(state),
      objects: state.objects.filter((object) => object.id !== id && object.parentId !== id),
      selectedObjectId: state.selectedObjectId === id ? undefined : state.selectedObjectId,
      selectedObjectIds: state.selectedObjectIds.filter((selectedId) => selectedId !== id)
    }));
  },

  selectObject: (id, additive = false) =>
    set((state) => {
      if (!id) return { selectedObjectId: undefined, selectedObjectIds: [] };
      if (!additive) return { selectedObjectId: id, selectedObjectIds: [id] };
      const exists = state.selectedObjectIds.includes(id);
      const selectedObjectIds = exists ? state.selectedObjectIds.filter((item) => item !== id) : [...state.selectedObjectIds, id];
      return { selectedObjectId: selectedObjectIds.at(-1), selectedObjectIds };
    }),

  duplicateObject: (id) => {
    const object = get().objects.find((item) => item.id === id);
    if (!object) return;
    const duplicate = createStudioObject(object.type, {
      ...structuredClone(object),
      id: createId(object.type),
      name: `${object.name} Copy`,
      transform: {
        ...object.transform,
        position: [object.transform.position[0] + 0.6, object.transform.position[1], object.transform.position[2] + 0.6]
      }
    });
    set((state) => ({
      ...withHistory(state),
      objects: [...state.objects, duplicate],
      selectedObjectId: duplicate.id,
      selectedObjectIds: [duplicate.id]
    }));
  },

  duplicateSelected: () => {
    const state = get();
    const selectedIds = state.selectedObjectIds.length ? state.selectedObjectIds : state.selectedObjectId ? [state.selectedObjectId] : [];
    if (!selectedIds.length) return;
    const duplicates = state.objects
      .filter((object) => selectedIds.includes(object.id) && object.type !== "group")
      .map((object) =>
        createStudioObject(object.type, {
          ...structuredClone(object),
          id: createId(object.type),
          name: `${object.name} Copy`,
          parentId: undefined,
          childIds: [],
          transform: {
            ...object.transform,
            position: [object.transform.position[0] + 0.5, object.transform.position[1], object.transform.position[2] + 0.5]
          }
        })
      );
    set((current) => ({
      ...withHistory(current),
      objects: [...current.objects, ...duplicates],
      selectedObjectId: duplicates.at(-1)?.id,
      selectedObjectIds: duplicates.map((object) => object.id)
    }));
  },

  groupSelected: () => {
    const state = get();
    const selectedIds = state.selectedObjectIds.filter((id) => state.objects.some((object) => object.id === id && object.type !== "group"));
    if (selectedIds.length < 2) return;
    const selectedObjects = state.objects.filter((object) => selectedIds.includes(object.id));
    const center = selectedObjects.reduce<[number, number, number]>(
      (acc, object) => [acc[0] + object.transform.position[0], acc[1] + object.transform.position[1], acc[2] + object.transform.position[2]],
      [0, 0, 0]
    ).map((value) => value / selectedObjects.length) as [number, number, number];
    const group = createStudioObject("group", {
      name: `Group ${selectedIds.length}`,
      childIds: selectedIds,
      transform: { position: center, rotation: [0, 0, 0], scale: [1, 1, 1] },
      material: { color: "#64748b", roughness: 0.6, metalness: 0, opacity: 0.35 }
    });
    set((current) => ({
      ...withHistory(current),
      objects: [...current.objects.map((object) => (selectedIds.includes(object.id) ? { ...object, parentId: group.id } : object)), group],
      selectedObjectId: group.id,
      selectedObjectIds: [group.id]
    }));
  },

  ungroupObject: (id) => {
    const group = get().objects.find((object) => object.id === id && object.type === "group");
    if (!group) return;
    set((state) => ({
      ...withHistory(state),
      objects: state.objects.filter((object) => object.id !== id).map((object) => (object.parentId === id ? { ...object, parentId: undefined } : object)),
      selectedObjectId: group.childIds?.[0],
      selectedObjectIds: group.childIds ?? []
    }));
  },

  snapSelectedToGrid: (gridSize = 0.5) => {
    const selectedIds = get().selectedObjectIds;
    if (!selectedIds.length) return;
    set((state) => ({
      ...withHistory(state),
      objects: state.objects.map((object) =>
        selectedIds.includes(object.id)
          ? {
              ...object,
              transform: {
                ...object.transform,
                position: object.transform.position.map((value) => Math.round(value / gridSize) * gridSize) as [number, number, number]
              }
            }
          : object
      )
    }));
  },

  alignSelected: (axis, mode) => {
    const selectedObjects = get().objects.filter((object) => get().selectedObjectIds.includes(object.id));
    if (selectedObjects.length < 2) return;
    const index = axis === "x" ? 0 : 2;
    const values = selectedObjects.map((object) => object.transform.position[index]);
    const target = mode === "min" ? Math.min(...values) : mode === "max" ? Math.max(...values) : values.reduce((sum, value) => sum + value, 0) / values.length;
    set((state) => ({
      ...withHistory(state),
      objects: state.objects.map((object) =>
        state.selectedObjectIds.includes(object.id)
          ? { ...object, transform: { ...object.transform, position: object.transform.position.map((value, itemIndex) => (itemIndex === index ? target : value)) as [number, number, number] } }
          : object
      )
    }));
  },

  renameObject: (id, name) => get().updateObject(id, { name: name.trim() || "Object" }),

  setMaterial: (id, material) => {
    const object = get().objects.find((item) => item.id === id);
    if (!object) return;
    get().updateObject(id, { material: { ...object.material, ...material } });
  },

  setTransform: (id, transform, recordHistory = true) => {
    const object = get().objects.find((item) => item.id === id);
    if (!object || object.locked) return;
    get().updateObject(id, { transform: { ...object.transform, ...transform } }, recordHistory);
  },

  addModifier: (id, type) => {
    const names: Record<ModifierType, string> = {
      boolean: "Boolean",
      bevel: "Bevel",
      mirror: "Mirror",
      subdivision: "Subdivision Surface"
    };
    const object = get().objects.find((item) => item.id === id);
    if (!object) return;
    get().updateObject(id, {
      modifiers: [
        ...object.modifiers,
        {
          id: createId("modifier"),
          type,
          name: names[type],
          enabled: true,
          applied: false,
          settings: type === "bevel" ? { amount: 0.05, segments: 2 } : type === "subdivision" ? { levels: 1 } : {}
        }
      ]
    });
  },

  toggleModifier: (objectId, modifierId) => {
    const object = get().objects.find((item) => item.id === objectId);
    if (!object) return;
    get().updateObject(objectId, { modifiers: object.modifiers.map((modifier) => (modifier.id === modifierId ? { ...modifier, enabled: !modifier.enabled } : modifier)) });
  },

  applyModifier: (objectId, modifierId) => {
    const object = get().objects.find((item) => item.id === objectId);
    if (!object) return;
    get().updateObject(objectId, { modifiers: object.modifiers.map((modifier) => (modifier.id === modifierId ? { ...modifier, applied: true } : modifier)) });
  },

  deleteModifier: (objectId, modifierId) => {
    const object = get().objects.find((item) => item.id === objectId);
    if (!object) return;
    get().updateObject(objectId, { modifiers: object.modifiers.filter((modifier) => modifier.id !== modifierId) });
  },

  addProductTemplate: (templateId) => {
    const template = getProductTemplate(templateId);
    if (!template) return undefined;
    return get().addObject(template.placeholder.objectType, {
      name: template.name,
      productMockupType: template.id,
      productTemplateId: template.id,
      transform: template.placeholder.transform,
      material: { color: template.defaultColor, roughness: 0.72, metalness: template.category === "Drinkware" ? 0.2 : 0, opacity: 1 }
    });
  },

  addDecalToPrintableArea: (templateId, areaId, imageUrl, name = "Design Decal") => {
    const template = getProductTemplate(templateId);
    const area = template?.printableAreas.find((item) => item.id === areaId);
    if (!template || !area) return undefined;
    return get().addObject("decal", {
      name: `${name} - ${area.name}`,
      productMockupType: template.id,
      productTemplateId: template.id,
      printableAreaId: area.id,
      decalImageUrl: imageUrl,
      transform: area.transform,
      material: { color: "#ffffff", roughness: 0.2, metalness: 0, opacity: 1 }
    });
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setTransformMode: (mode) => set({ transformMode: mode, activeTool: mode === "translate" ? "move" : mode }),

  undo: () => {
    const current = get();
    const previous = current.history.at(-1);
    if (!previous) return;
    set({
      objects: previous.objects,
      selectedObjectId: previous.selectedObjectId,
      selectedObjectIds: previous.selectedObjectIds,
      viewportSettings: previous.viewportSettings,
      history: current.history.slice(0, -1),
      future: [snapshot(current), ...current.future]
    });
  },

  redo: () => {
    const current = get();
    const next = current.future[0];
    if (!next) return;
    set({
      objects: next.objects,
      selectedObjectId: next.selectedObjectId,
      selectedObjectIds: next.selectedObjectIds,
      viewportSettings: next.viewportSettings,
      history: [...current.history, snapshot(current)],
      future: current.future.slice(1)
    });
  },

  saveProject: () => {
    if (typeof window === "undefined") return;
    const state = get();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        projectId: state.projectId,
        projectName: state.projectName,
        objects: state.objects,
        selectedObjectId: state.selectedObjectId,
        selectedObjectIds: state.selectedObjectIds,
        viewportSettings: state.viewportSettings,
        savedAt: new Date().toISOString()
      })
    );
  },

  loadProject: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const project = JSON.parse(raw) as SceneState;
      set({
        projectId: project.projectId,
        projectName: project.projectName,
        objects: project.objects.map(normalizeObject),
        selectedObjectId: project.selectedObjectId,
        selectedObjectIds: project.selectedObjectIds ?? (project.selectedObjectId ? [project.selectedObjectId] : []),
        viewportSettings: project.viewportSettings ?? defaultViewportSettings,
        history: [],
        future: []
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },

  importModel: (object) => {
    set((state) => ({
      ...withHistory(state),
      objects: [...state.objects, object],
      selectedObjectId: object.id,
      selectedObjectIds: [object.id]
    }));
  },

  requestRender: async () => {
    const job: RenderJob = {
      id: createId("render"),
      status: "queued",
      message: "Render request queued for Blender worker.",
      createdAt: new Date().toISOString()
    };
    set((state) => ({ renderJobs: [job, ...state.renderJobs] }));

    try {
      get().updateRenderJob(job.id, { status: "processing", message: "Sending scene data to render endpoint." });
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: get().projectId,
          sceneData: get().objects,
          cameraData: {},
          renderSettings: { engine: "placeholder" }
        })
      });

      if (!response.ok) {
        throw new Error("Render endpoint rejected the scene data.");
      }

      const result = (await response.json()) as { jobId?: string; status?: RenderJob["status"]; message?: string; outputUrl?: string };
      get().updateRenderJob(job.id, {
        id: result.jobId ?? job.id,
        status: result.status ?? "queued",
        message: result.message ?? "Render job accepted.",
        previewUrl: result.outputUrl
      });
    } catch (error) {
      get().updateRenderJob(job.id, {
        status: "failed",
        message: error instanceof Error ? error.message : "Render request failed."
      });
    }

    return job;
  },

  pollRenderJob: async (id) => {
    try {
      const response = await fetch(`/api/render/${id}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Render status endpoint rejected the request.");
      }
      const result = (await response.json()) as { jobId?: string; status?: RenderJob["status"]; message?: string; outputUrl?: string; error?: string };
      get().updateRenderJob(id, {
        id: result.jobId ?? id,
        status: result.status ?? "queued",
        message: result.message ?? result.error ?? "Render status updated.",
        previewUrl: result.outputUrl
      });
    } catch (error) {
      get().updateRenderJob(id, {
        status: "failed",
        message: error instanceof Error ? error.message : "Render status polling failed."
      });
    }
  },

  updateRenderJob: (id, patch) => {
    set((state) => ({
      renderJobs: state.renderJobs.map((job) => (job.id === id ? { ...job, ...patch } : job))
    }));
  },

  updateViewportSettings: (settings) => {
    set((state) => ({
      ...withHistory(state),
      viewportSettings: { ...state.viewportSettings, ...settings }
    }));
  },

  resetProject: () => {
    const object = createStudioObject("cube", {
      name: "Hero Product Block",
      transform: { position: [0, 0.55, 0], rotation: [0, 0, 0], scale: [1.6, 1.1, 1.6] },
      material: { color: "#38bdf8", roughness: 0.42, metalness: 0.08, opacity: 1 }
    });
    set({
      projectId: createId("project"),
      projectName: "Untitled 3D Product",
      objects: [object],
      selectedObjectId: object.id,
      selectedObjectIds: [object.id],
      viewportSettings: defaultViewportSettings,
      history: [],
      future: []
    });
  }
}));
