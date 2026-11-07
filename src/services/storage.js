import { db } from "../lib/supabase.js";

const BUCKET = "images";
const MAX_BYTES = 3 * 1024 * 1024;

export async function uploadImage(file, folder) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > MAX_BYTES) throw new Error("Image must be 3 MB or smaller.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db().storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
