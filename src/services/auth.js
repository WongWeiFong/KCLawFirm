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

// The signed-in user's own profile row (allowed by row-level security).
export async function fetchProfile(userId) {
  const { data } = await db().from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

// Checks the current password first, then sets the new one.
export async function changePassword(email, currentPassword, newPassword) {
  const { error: checkError } = await db().auth.signInWithPassword({ email, password: currentPassword });
  if (checkError) throw new Error("Your current password is incorrect.");
  const { error } = await db().auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message || "Could not change the password.");
}
