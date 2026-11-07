import { db } from "../lib/supabase.js";
import { recordPresence } from "./presence.js";

export const LOGIN_EMAIL_PATTERN = "[^'\"\\s@]+@[^'\"\\s@]+\\.[^'\"\\s@]+";
const isLoginEmail = (email) => new RegExp(`^${LOGIN_EMAIL_PATTERN}$`).test(email);

export async function signIn(email, password) {
  const normalizedEmail = email.trim();
  if (!isLoginEmail(normalizedEmail)) throw new Error("Enter a valid email address.");
  const { error } = await db().auth.signInWithPassword({ email: normalizedEmail, password });
  if (error) throw error;
  try {
    await recordPresence({ isLogin: true });
  } catch (presenceError) {
    console.error("Could not record login time. Apply supabase/migration-5.sql.", presenceError);
  }
}

export async function signOut() {
  try {
    await recordPresence({ signedOut: true });
  } catch (presenceError) {
    console.error("Could not update staff presence during sign out.", presenceError);
  }
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

export async function updateOwnProfile(userId, { full_name, phone }) {
  const { data, error } = await db()
    .from("profiles")
    .update({ full_name, phone })
    .eq("id", userId)
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateOwnAdminProfile({ full_name, email, phone, role, is_active }) {
  const session = await getSession();
  if (!session?.access_token) throw new Error("Please log in again.");

  const response = await fetch("/api/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action: "update_own_profile", full_name, email, phone, role, is_active }),
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }
  if (!response.ok) throw new Error(result.error || "Could not update your profile.");
  return result;
}

// Checks the current password first, then sets the new one.
export async function changePassword(email, currentPassword, newPassword) {
  const { error: checkError } = await db().auth.signInWithPassword({ email, password: currentPassword });
  if (checkError) throw new Error("Your current password is incorrect.");
  const { error } = await db().auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message || "Could not change the password.");
}
