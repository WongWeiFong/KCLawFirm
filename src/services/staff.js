import { db, unwrap } from "../lib/supabase.js";

// Reading staff is allowed for admins by row-level security.
export async function listStaff() {
  return unwrap(await db().from("profiles").select("*").in("role", ["staff", "viewer"]).order("created_at", { ascending: false }));
}

export async function getStaff(id) {
  return unwrap(await db().from("profiles").select("*").eq("id", id).in("role", ["staff", "viewer"]).maybeSingle());
}

// Creating, changing and removing accounts happens in the server function (api/staff.js).
async function call(action, payload) {
  const { data } = await db().auth.getSession();
  const res = await fetch("/api/staff", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}` },
    body: JSON.stringify({ action, ...payload }),
  });
  if (res.status === 404) {
    throw new Error("Staff management needs the server function. Use `vercel dev` locally, or the deployed site.");
  }
  let json = {};
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) throw new Error(json.error || "The request failed.");
  return json;
}

export const createStaff = (values) => call("create", values);
export const updateStaff = (id, values) => call("update", { id, ...values });
export const setStaffActive = (id, isActive) => call("set_active", { id, is_active: isActive });
export const deleteStaff = (id) => call("delete", { id });
