import { db } from "../lib/supabase.js";

export async function signIn(email, password) {
  const { error } = await db().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await db().auth.signOut();
}

export async function getSession() {
  const { data } = await db().auth.getSession();
  return data.session;
}

export function onAuthChange(callback) {
  return db().auth.onAuthStateChange((_event, session) => callback(session));
}

// Reads the signed-in user's own profile row (allowed by row-level security).
export async function fetchIsAdmin(userId) {
  const { data } = await db().from("profiles").select("role").eq("id", userId).maybeSingle();
  return data?.role === "admin";
}
