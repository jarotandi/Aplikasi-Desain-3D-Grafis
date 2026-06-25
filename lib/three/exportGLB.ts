import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import type { Object3D } from "three";

export function exportObjectAsGLB(object: Object3D, filename = "project-export.glb") {
  const exporter = new GLTFExporter();

  exporter.parse(
    object,
    (result) => {
      const blob = result instanceof ArrayBuffer ? new Blob([result], { type: "model/gltf-binary" }) : new Blob([JSON.stringify(result, null, 2)], { type: "model/gltf+json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      throw error;
    },
    { binary: true }
  );
}
