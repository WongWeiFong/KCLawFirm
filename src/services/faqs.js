import { db, unwrap } from "../lib/supabase.js";
import { nextOrder } from "./ordering.js";

const T = "faqs";

export async function listActiveFaqs() {
  return unwrap(await db().from(T).select("*").eq("is_active", true).order("display_order"));
}

export async function listAllFaqs() {
  return unwrap(await db().from(T).select("*").order("display_order"));
}

export async function saveFaq(id, values) {
  if (id) {
    return unwrap(await db().from(T).update({ ...values, updated_at: new Date().toISOString() }).eq("id", id).select().single());
  }
  return unwrap(await db().from(T).insert({ ...values, display_order: await nextOrder(T) }).select().single());
}

export async function setFaqActive(id, isActive) {
  unwrap(await db().from(T).update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id));
}

export async function deleteFaq(id) {
  unwrap(await db().from(T).delete().eq("id", id));
}
