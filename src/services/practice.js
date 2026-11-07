import { db, unwrap } from "../lib/supabase.js";
import { nextOrder } from "./ordering.js";

const T = "practice_areas";

export async function listActivePractice() {
  return unwrap(await db().from(T).select("*").eq("is_active", true).order("display_order"));
}

export async function getPracticeBySlug(slug) {
  return unwrap(await db().from(T).select("*").eq("slug", slug).eq("is_active", true).maybeSingle());
}

export async function listAllPractice() {
  return unwrap(await db().from(T).select("*").order("display_order"));
}

export async function getPractice(id) {
  return unwrap(await db().from(T).select("*").eq("id", id).maybeSingle());
}

export async function createPractice(values) {
  const order = values.display_order ?? (await nextOrder(T));
  return unwrap(await db().from(T).insert({ ...values, display_order: order }).select().single());
}

export async function updatePractice(id, values) {
  return unwrap(await db().from(T).update({ ...values, updated_at: new Date().toISOString() }).eq("id", id).select().single());
}

export async function setPracticeActive(id, isActive) {
  unwrap(await db().from(T).update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id));
}

export async function deletePractice(id) {
  unwrap(await db().from(T).delete().eq("id", id));
}
