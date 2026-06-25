export function validateImportExtension(fileName: string) {
  return /\.(glb|gltf|obj|stl|svg|png|jpe?g)$/i.test(fileName);
}
