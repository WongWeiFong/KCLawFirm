import { db, unwrap } from "../lib/supabase.js";

// Saves a display order from an array of ids (first = 1) for any table with a display_order column.
export async function saveOrder(table, ids) {
  await Promise.all(ids.map((id, i) => db().from(table).update({ display_order: i + 1 }).eq("id", id).then(unwrap)));
}

export async function nextOrder(table) {
  const last = unwrap(await db().from(table).select("display_order").order("display_order", { ascending: false }).limit(1));
  return (last?.[0]?.display_order ?? 0) + 1;
}
