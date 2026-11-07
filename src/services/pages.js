import { db, unwrap } from "../lib/supabase.js";

export async function getPage(slug) {
  return unwrap(await db().from("site_pages").select("*").eq("slug", slug).maybeSingle());
}

export async function savePage(slug, values) {
  return unwrap(
    await db().from("site_pages").upsert({ ...values, slug, updated_at: new Date().toISOString() }).select().single()
  );
}
