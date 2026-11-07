import { db, unwrap } from "../lib/supabase.js";

export async function recordPresence({ isLogin = false, signedOut = false } = {}) {
  const { error } = await db().rpc("record_staff_presence", {
    p_is_login: isLogin,
    p_signed_out: signedOut,
  });
  if (error) throw error;
}

export async function listStaffPresence() {
  return unwrap(await db().rpc("get_staff_presence"));
}
