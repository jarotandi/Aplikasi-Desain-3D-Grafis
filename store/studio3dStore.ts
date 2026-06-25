"use client";

import { create } from "zustand";
import { defaultMaterials } from "@/data/defaultMaterials";
import type { StudioMaterial } from "@/types/material";
import type { OrderQuotation } from "@/types/order";
import type { Dimensions, GeometryType, SceneObject, SnapMode, Studio3DState, StudioHistorySnapshot, StudioLayer, StudioProject, StudioToolId, StudioUnit, TransformMode3D, Vector3Value } from "@/types/studio3d";
import { createId } from "@/lib/utils/id";
import { snapVector } from "@/lib/three/snapUtils";

const STORAGE_KEY = "web-based-studio-3d-project";

interface Studio3DStore extends Studio3DState {
  createProject: (name?: string) => void;
  loadProject: () => void;
  saveProject: () => void;
  addObject: (geometryType: GeometryType, overrides?: Partial<SceneObject>) => string;
  updateObject: (id: string, patch: Partial<SceneObject>) => void;
  deleteObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  selectObject: (id?: string, additive?: boolean) => void;
  clearSelection: () => void;
  groupObjects: () => void;
  ungroupObjects: () => void;
  setActiveTool: (tool: StudioToolId) => void;
  setTransformMode: (mode: TransformMode3D) => void;
  setUnit: (unit: StudioUnit) => void;
  setGridSize: (gridSize: number) => void;
  setSnapMode: (snapMode: SnapMode) => void;
  toggleSnap: () => void;
  updateMeasurementFromInput: (input: string) => void;
  createRectangleFromMeasurement: () => string;
  pushPullSelected: (depth?: number) => void;
  addLayer: (name?: string) => void;
  updateLayer: (id: string, patch: Partial<StudioLayer>) => void;
  importAsset: (file: File) => Promise<void>;
  undo: () => void;
  redo: () => void;
  applyMaterialToSelected: (materialId: string) => void;
  updateMaterial: (materialId: string, patch: Partial<StudioMaterial>) => void;
  createBoxFromMeasurement: () => void;
  updateExtrudeDepth: (objectId: string, depth: number) => void;
  exportProject: () => StudioProject;
  createQuotation: (quantity: number) => OrderQuotation;
}

function now() {
  return new Date().toISOString();
}

function vector(x = 0, y = 0, z = 0): Vector3Value {
  return { x, y, z };
}

function dimensions(width = 1, height = 1, depth = 1): Dimensions {
  return { width, height, depth };
}

function parseUnitValue(raw: string, fallback: number, unit: StudioUnit) {
  const match = raw.trim().toLowerCase().match(/^(-?\d+(?:\.\d+)?)(mm|cm|m|inch|in)?$/);
  if (!match) return fallback;
  const value = Number(match[1]);
  const sourceUnit = match[2] === "in" ? "inch" : (match[2] as StudioUnit | undefined) ?? unit;
  const meters = sourceUnit === "mm" ? value / 1000 : sourceUnit === "cm" ? value / 100 : sourceUnit === "inch" ? value * 0.0254 : value;
  if (unit === "mm") return meters * 1000;
  if (unit === "cm") return meters * 100;
  if (unit === "inch") return meters / 0.0254;
  return meters;
}

function parseMeasurementInput(input: string, current: Dimensions, unit: StudioUnit): Dimensions {
  const parts = input.split(/[x, ,]+/).filter(Boolean);
  return {
    width: parseUnitValue(parts[0] ?? "", current.width, unit),
    depth: parseUnitValue(parts[1] ?? "", current.depth, unit),
    height: parseUnitValue(parts[2] ?? "", current.height, unit)
  };
}

function snapshot(state: Studio3DStore): StudioHistorySnapshot {
  return {
    sceneObjects: structuredClone(state.sceneObjects),
    selectedObjectIds: [...state.selectedObjectIds],
    materials: structuredClone(state.materials),
    layers: structuredClone(state.layers)
  };
}

function historyPatch(state: Studio3DStore) {
  return {
    history: [...state.history.slice(-39), snapshot(state)],
    future: [],
    isDirty: true
  };
}

function createSceneObject(geometryType: GeometryType, overrides: Partial<SceneObject> = {}): SceneObject {
  const id = overrides.id ?? createId(geometryType);
  const baseDimensions =
    geometryType === "floor" ? dimensions(3, 0.05, 3) :
    geometryType === "wall" || geometryType === "backdrop" ? dimensions(3, 2.4, 0.12) :
    geometryType === "banner-stand" ? dimensions(0.8, 2, 0.05) :
    geometryType === "table" ? dimensions(1.4, 0.75, 0.7) :
    geometryType === "chair" ? dimensions(0.55, 0.9, 0.55) :
    geometryType === "packaging-box" ? dimensions(1, 0.7, 0.8) :
    dimensions(1, 1, 1);

  return {
    id,
    name: overrides.name ?? `${geometryType.replaceAll("-", " ")} ${id.slice(-4)}`,
    type: overrides.type ?? (geometryType === "decal" ? "decal" : "mesh"),
    geometryType,
    position: overrides.position ?? vector(0, baseDimensions.height / 2, 0),
    rotation: overrides.rotation ?? vector(),
    scale: overrides.scale ?? vector(1, 1, 1),
    dimensions: overrides.dimensions ?? baseDimensions,
    materialId: overrides.materialId ?? "mat-cotton",
    layerId: overrides.layerId ?? "layer-default",
    isLocked: overrides.isLocked ?? false,
    isVisible: overrides.isVisible ?? true,
    parentId: overrides.parentId,
    childIds: overrides.childIds ?? [],
    metadata: overrides.metadata ?? {},
    productionData: overrides.productionData ?? {}
  };
}

function createProject(name = "Untitled 3D Studio Project"): StudioProject {
  const createdAt = now();
  return {
    id: createId("studio3d-project"),
    userId: "local-user",
    name,
    description: "Local MVP project",
    unit: "m",
    sceneJson: {},
    objects: [],
    materials: defaultMaterials,
    productMockups: [],
    createdAt,
    updatedAt: createdAt
  };
}

const starterProject = createProject();
const starterObjects = [
  createSceneObject("cube", {
    name: "Starter Cube",
    position: vector(0, 0.5, 0),
    dimensions: dimensions(1, 1, 1),
    materialId: "mat-dryfit"
  })
];

export const useStudio3DStore = create<Studio3DStore>((set, get) => ({
  currentProject: { ...starterProject, objects: starterObjects },
  sceneObjects: starterObjects,
  selectedObjectIds: [starterObjects[0].id],
  activeTool: "select",
  transformMode: "translate",
  unit: "m",
  gridSize: 0.5,
  snapEnabled: true,
  snapMode: "grid",
  cameraView: "perspective",
  materials: defaultMaterials,
  layers: [{ id: "layer-default", name: "Default", isVisible: true, isLocked: false }],
  productMockups: [],
  history: [],
  future: [],
  isSaving: false,
  isDirty: false,
  measurement: { width: 2, depth: 3, height: 1 },

  createProject: (name) => {
    const project = createProject(name);
    set({ currentProject: project, sceneObjects: [], selectedObjectIds: [], materials: defaultMaterials, productMockups: [], history: [], future: [], isDirty: false });
  },

  loadProject: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const project = JSON.parse(raw) as StudioProject;
    set({ currentProject: project, sceneObjects: project.objects, materials: project.materials, productMockups: project.productMockups, selectedObjectIds: [], isDirty: false });
  },

  saveProject: () => {
    if (typeof window === "undefined") return;
    const state = get();
    const project: StudioProject = {
      ...state.currentProject,
      objects: state.sceneObjects,
      materials: state.materials,
      productMockups: state.productMockups,
      sceneJson: {
        cameraView: state.cameraView,
        gridSize: state.gridSize,
        snapEnabled: state.snapEnabled,
        layers: state.layers
      },
      updatedAt: now()
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    set({ currentProject: project, isDirty: false });
  },

  addObject: (geometryType, overrides) => {
    const object = createSceneObject(geometryType, overrides);
    set((state) => ({ ...historyPatch(state), sceneObjects: [...state.sceneObjects, object], selectedObjectIds: [object.id] }));
    return object.id;
  },

  updateObject: (id, patch) => {
    set((state) => ({
      ...historyPatch(state),
      sceneObjects: state.sceneObjects.map((object) =>
        object.id === id
          ? {
              ...object,
              ...patch,
              position: patch.position && state.snapEnabled ? snapVector(patch.position, { gridSize: state.gridSize, mode: state.snapMode, objects: state.sceneObjects, excludeIds: [id] }) : (patch.position ?? object.position)
            }
          : object
      )
    }));
  },

  deleteObject: (id) => {
    set((state) => ({ ...historyPatch(state), sceneObjects: state.sceneObjects.filter((object) => object.id !== id && object.parentId !== id), selectedObjectIds: state.selectedObjectIds.filter((selectedId) => selectedId !== id) }));
  },

  duplicateObject: (id) => {
    const object = get().sceneObjects.find((item) => item.id === id);
    if (!object) return;
    const copy = { ...structuredClone(object), id: createId(object.geometryType), name: `${object.name} Copy`, position: { x: object.position.x + 0.5, y: object.position.y, z: object.position.z + 0.5 }, parentId: undefined, childIds: [] };
    set((state) => ({ ...historyPatch(state), sceneObjects: [...state.sceneObjects, copy], selectedObjectIds: [copy.id] }));
  },

  selectObject: (id, additive = false) => {
    set((state) => {
      if (!id) return { selectedObjectIds: [] };
      if (!additive) return { selectedObjectIds: [id] };
      const selectedObjectIds = state.selectedObjectIds.includes(id) ? state.selectedObjectIds.filter((item) => item !== id) : [...state.selectedObjectIds, id];
      return { selectedObjectIds };
    });
  },

  clearSelection: () => set({ selectedObjectIds: [] }),

  groupObjects: () => {
    const state = get();
    if (state.selectedObjectIds.length < 2) return;
    const group = createSceneObject("cube", {
      type: "group",
      name: `Group ${state.selectedObjectIds.length}`,
      childIds: state.selectedObjectIds,
      dimensions: dimensions(0.1, 0.1, 0.1),
      materialId: "mat-acrylic"
    });
    set((current) => ({ ...historyPatch(current), sceneObjects: [...current.sceneObjects.map((object) => (current.selectedObjectIds.includes(object.id) ? { ...object, parentId: group.id } : object)), group], selectedObjectIds: [group.id] }));
  },

  ungroupObjects: () => {
    const state = get();
    const groupIds = state.selectedObjectIds;
    set((current) => ({ ...historyPatch(current), sceneObjects: current.sceneObjects.filter((object) => !groupIds.includes(object.id)).map((object) => (object.parentId && groupIds.includes(object.parentId) ? { ...object, parentId: undefined } : object)), selectedObjectIds: [] }));
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setTransformMode: (mode) => set({ transformMode: mode, activeTool: mode === "translate" ? "move" : mode }),
  setUnit: (unit) => set({ unit, isDirty: true }),
  setGridSize: (gridSize) => set({ gridSize, isDirty: true }),
  setSnapMode: (snapMode) => set({ snapMode, isDirty: true }),
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  updateMeasurementFromInput: (input) => {
    set((state) => ({
      measurement: {
        ...state.measurement,
        ...parseMeasurementInput(input, state.measurement, state.unit),
        rawInput: input
      }
    }));
  },

  undo: () => {
    const state = get();
    const previous = state.history.at(-1);
    if (!previous) return;
    set({ sceneObjects: previous.sceneObjects, selectedObjectIds: previous.selectedObjectIds, materials: previous.materials, layers: previous.layers, history: state.history.slice(0, -1), future: [snapshot(state), ...state.future], isDirty: true });
  },

  redo: () => {
    const state = get();
    const next = state.future[0];
    if (!next) return;
    set({ sceneObjects: next.sceneObjects, selectedObjectIds: next.selectedObjectIds, materials: next.materials, layers: next.layers, history: [...state.history, snapshot(state)], future: state.future.slice(1), isDirty: true });
  },

  applyMaterialToSelected: (materialId) => {
    set((state) => ({ ...historyPatch(state), sceneObjects: state.sceneObjects.map((object) => (state.selectedObjectIds.includes(object.id) ? { ...object, materialId } : object)) }));
  },

  updateMaterial: (materialId, patch) => {
    set((state) => ({ ...historyPatch(state), materials: state.materials.map((material) => (material.id === materialId ? { ...material, ...patch } : material)) }));
  },

  createBoxFromMeasurement: () => {
    const measurement = get().measurement;
    get().addObject("box", {
      name: `Box ${measurement.width}x${measurement.depth}x${measurement.height}${get().unit}`,
      dimensions: dimensions(measurement.width, measurement.height, measurement.depth),
      position: vector(0, measurement.height / 2, 0),
      materialId: "mat-plywood",
      metadata: { createdBy: "rectangle-pushpull-mvp" }
    });
  },

  createRectangleFromMeasurement: () => {
    const measurement = get().measurement;
    return get().addObject("plane", {
      name: `Rectangle ${measurement.width}x${measurement.depth}${get().unit}`,
      dimensions: dimensions(measurement.width, measurement.depth, 0.01),
      position: vector(0, 0.01, 0),
      rotation: vector(-Math.PI / 2, 0, 0),
      materialId: "mat-acrylic",
      metadata: {
        shape2D: {
          type: "rectangle",
          points: [
            [-measurement.width / 2, -measurement.depth / 2],
            [measurement.width / 2, -measurement.depth / 2],
            [measurement.width / 2, measurement.depth / 2],
            [-measurement.width / 2, measurement.depth / 2]
          ],
          normal: [0, 1, 0]
        },
        pushPullReady: true
      }
    });
  },

  pushPullSelected: (depth) => {
    const state = get();
    const object = state.sceneObjects.find((item) => item.id === state.selectedObjectIds[0]);
    if (!object) return;
    const nextDepth = depth ?? state.measurement.height;
    if (object.geometryType === "plane" || object.metadata.pushPullReady) {
      get().updateObject(object.id, {
        geometryType: "box",
        dimensions: dimensions(object.dimensions.width, nextDepth, object.dimensions.height || object.dimensions.depth),
        position: { x: object.position.x, y: nextDepth / 2, z: object.position.z },
        rotation: vector(),
        metadata: { ...object.metadata, pushPullDepth: nextDepth, extrudedFromShape: object.metadata.shape2D ?? "plane" }
      });
      return;
    }
    get().updateExtrudeDepth(object.id, nextDepth);
  },

  updateExtrudeDepth: (objectId, depth) => {
    const object = get().sceneObjects.find((item) => item.id === objectId);
    if (!object) return;
    get().updateObject(objectId, { dimensions: { ...object.dimensions, height: depth }, position: { ...object.position, y: depth / 2 }, metadata: { ...object.metadata, pushPullDepth: depth } });
  },

  addLayer: (name = "New Layer") => {
    const layer: StudioLayer = { id: createId("layer"), name, isVisible: true, isLocked: false };
    set((state) => ({ ...historyPatch(state), layers: [...state.layers, layer] }));
  },

  updateLayer: (id, patch) => {
    set((state) => ({
      ...historyPatch(state),
      layers: state.layers.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)),
      sceneObjects:
        "isVisible" in patch || "isLocked" in patch
          ? state.sceneObjects.map((object) => (object.layerId === id ? { ...object, isVisible: patch.isVisible ?? object.isVisible, isLocked: patch.isLocked ?? object.isLocked } : object))
          : state.sceneObjects
    }));
  },

  importAsset: async (file) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "asset";
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read import file."));
      reader.readAsDataURL(file);
    });
    get().addObject("imported", {
      name: file.name,
      dimensions: dimensions(1.2, 1.2, 1.2),
      position: vector(0, 0.6, 0),
      materialId: "mat-acrylic",
      metadata: { importType: ext, importDataUrl: dataUrl, sourceFileName: file.name }
    });
  },

  exportProject: () => ({ ...get().currentProject, objects: get().sceneObjects, materials: get().materials, productMockups: get().productMockups, updatedAt: now() }),

  createQuotation: (quantity) => {
    const state = get();
    const selectedObjects = state.sceneObjects.filter((object) => state.selectedObjectIds.includes(object.id));
    const estimatedUsage = selectedObjects.reduce((sum, object) => sum + object.dimensions.width * object.dimensions.depth * Math.max(1, object.dimensions.height), 1);
    const materialCost = selectedObjects.reduce((sum, object) => sum + (state.materials.find((material) => material.id === object.materialId)?.pricePerUnit ?? 0) * estimatedUsage, 0);
    const productionCost = 25000 * quantity;
    const designCost = 150000;
    const vendorCost = 75000;
    const subtotal = materialCost + productionCost + designCost + vendorCost;
    const margin = subtotal * 0.25;
    const tax = subtotal * 0.11;
    const quotation: OrderQuotation = {
      id: createId("studio3d-quotation"),
      projectId: state.currentProject.id,
      products: selectedObjects.map((object) => ({ productType: object.geometryType, materialId: object.materialId, printArea: object.productionData.printableArea ?? "front", size: "standard", quantity, productionMethod: object.productionData.printMethod ?? "standard" })),
      quantity,
      materialCost,
      productionCost,
      designCost,
      vendorCost,
      margin,
      tax,
      totalPrice: subtotal + margin + tax,
      status: "draft",
      createdAt: now(),
      updatedAt: now()
    };
    set({ currentQuotation: quotation, isDirty: true });
    return quotation;
  }
}));
