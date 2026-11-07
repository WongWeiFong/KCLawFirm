import { db, unwrap } from "../lib/supabase.js";

const T = "articles";
const LIST = "id,title,slug,excerpt,image_url,author,published_at";

// Public (row-level security only returns published rows to visitors)
export async function listPublished() {
  return unwrap(await db().from(T).select(LIST).eq("status", "published").order("published_at", { ascending: false }));
}

export async function getPublishedBySlug(slug) {
  return unwrap(await db().from(T).select("*").eq("slug", slug).eq("status", "published").maybeSingle());
}

// Admin
export async function listAllArticles() {
  return unwrap(await db().from(T).select("*").order("created_at", { ascending: false }));
}

export async function getArticle(id) {
  return unwrap(await db().from(T).select("*").eq("id", id).maybeSingle());
}

export async function createArticle(values) {
  return unwrap(await db().from(T).insert(values).select().single());
}

export async function updateArticle(id, values) {
  return unwrap(await db().from(T).update({ ...values, updated_at: new Date().toISOString() }).eq("id", id).select().single());
}

export async function deleteArticle(id) {
  unwrap(await db().from(T).delete().eq("id", id));
}
