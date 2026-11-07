import { db, unwrap } from "../lib/supabase.js";

// Firm-wide settings (one row, id = 1)
export async function getSettings() {
  return unwrap(await db().from("site_settings").select("*").eq("id", 1).maybeSingle());
}

export async function saveSettings(values) {
  return unwrap(
    await db().from("site_settings").upsert({ ...values, id: 1, updated_at: new Date().toISOString() }).select().single()
  );
}

// Offices
export async function listActiveOffices() {
  return unwrap(await db().from("offices").select("*").eq("is_active", true).order("display_order"));
}

export async function listAllOffices() {
  return unwrap(await db().from("offices").select("*").order("display_order"));
}

export async function saveOffice(id, values) {
  const t = db().from("offices");
  if (id) return unwrap(await t.update({ ...values, updated_at: new Date().toISOString() }).eq("id", id).select().single());
  return unwrap(await t.insert(values).select().single());
}

export async function deleteOffice(id) {
  unwrap(await db().from("offices").delete().eq("id", id));
}
