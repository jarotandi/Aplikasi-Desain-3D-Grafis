export function booleanOperationPlaceholder(operation: "union" | "subtract" | "intersect") {
  return {
    operation,
    status: "placeholder",
    message: "Boolean geometry will be processed by Blender/trimesh backend in a later phase."
  };
}
