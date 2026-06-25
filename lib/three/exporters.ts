import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import type { Object3D } from "three";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportGLB(object: Object3D, filename = "studio-3d-export.glb") {
  new GLTFExporter().parse(
    object,
    (result) => {
      const blob = result instanceof ArrayBuffer ? new Blob([result], { type: "model/gltf-binary" }) : new Blob([JSON.stringify(result)], { type: "model/gltf+json" });
      downloadBlob(blob, filename);
    },
    (error) => {
      throw error;
    },
    { binary: true }
  );
}

export function exportSTL(object: Object3D, filename = "studio-3d-export.stl") {
  const data = new STLExporter().parse(object);
  downloadBlob(new Blob([data], { type: "model/stl" }), filename);
}

export function exportOBJ(object: Object3D, filename = "studio-3d-export.obj") {
  const data = new OBJExporter().parse(object);
  downloadBlob(new Blob([data], { type: "text/plain" }), filename);
}

export function exportProjectJSON(data: unknown, filename = "studio-3d-project.json") {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), filename);
}
