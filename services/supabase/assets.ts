export async function uploadStudioAsset(file: File, path: string) {
  return { data: { path, name: file.name, url: "" }, error: null, mode: "supabase-storage-placeholder" };
}
