import type { StudioObject } from "@/lib/types/studio";
import { createStudioObject } from "@/lib/three/createPrimitive";

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export async function createImportedModelObject(file: File): Promise<StudioObject> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext !== "glb" && ext !== "gltf") {
    throw new Error("Only .glb and .gltf files are supported.");
  }

  const modelDataUrl = await fileToDataUrl(file);

  return createStudioObject("model", {
    name: file.name.replace(/\.(glb|gltf)$/i, ""),
    modelDataUrl,
    material: {
      color: "#ffffff",
      roughness: 0.5,
      metalness: 0,
      opacity: 1
    }
  });
}
