import { createSupabaseAdminClient } from "./admin";

export const VIDEO_BUCKET = "videos";

const VIDEO_CONTENT_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"]);

export function assertVideoFile(file: File) {
  if (!VIDEO_CONTENT_TYPES.has(file.type)) {
    throw new Error("Unsupported video type. Please upload an MP4, MOV, or WebM file.");
  }
}

export function createVideoStoragePath(profileId: string, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "mp4";

  return `${profileId}/${crypto.randomUUID()}.${safeExtension}`;
}

export async function uploadVideoToStorage(file: File, path: string) {
  assertVideoFile(file);

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
