import { db, unwrap } from "../lib/supabase.js";

const T = "lawyers";

export async function listActiveLawyers() {
  return unwrap(await db().from(T).select("*").eq("is_active", true).order("display_order"));
}

export async function getLawyer(id) {
  return unwrap(await db().from(T).select("*").eq("id", id).maybeSingle());
}

export async function listAllLawyers() {
  return unwrap(await db().from(T).select("*").order("display_order"));
}

export async function createLawyer(values) {
  let order = values.display_order;
  if (order == null) {
    const last = unwrap(await db().from(T).select("display_order").order("display_order", { ascending: false }).limit(1));
    order = (last?.[0]?.display_order ?? 0) + 1;
  }
  return unwrap(await db().from(T).insert({ ...values, display_order: order }).select().single());
}

export async function updateLawyer(id, values) {
  return unwrap(await db().from(T).update({ ...values, updated_at: new Date().toISOString() }).eq("id", id).select().single());
}

export async function setLawyerActive(id, isActive) {
  unwrap(await db().from(T).update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id));
}

export async function deleteLawyer(id) {
  unwrap(await db().from(T).delete().eq("id", id));
}

// Saves a new display order from an array of lawyer ids (first = 1).
export async function saveLawyerOrder(ids) {
  await Promise.all(ids.map((id, i) => db().from(T).update({ display_order: i + 1 }).eq("id", id).then(unwrap)));
}
