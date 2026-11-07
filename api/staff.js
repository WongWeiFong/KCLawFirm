// Server-side function (Vercel). Creating, changing and removing login accounts needs the
// Supabase service_role key, which must never be in the browser. This function:
//   1. checks the caller's login token,
//   2. checks the caller is an ACTIVE administrator,
//   3. only then touches STAFF accounts (never admins).
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const clean = (v, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

class UserError extends Error {}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!url || !serviceKey) return res.status(500).json({ error: "The server is not configured (missing service key)." });

  const sb = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  // 1 + 2. Who is calling, and are they an active admin?
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const { data: auth, error: authError } = await sb.auth.getUser(token);
  if (authError || !auth?.user) return res.status(401).json({ error: "Please log in again." });

  const { data: caller } = await sb.from("profiles").select("role,is_active").eq("id", auth.user.id).maybeSingle();
  if (caller?.role !== "admin" || !caller.is_active) return res.status(403).json({ error: "Only administrators can do this." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  async function requireStaff(id) {
    const { data } = await sb.from("profiles").select("role").eq("id", clean(id, 64)).maybeSingle();
    if (data?.role !== "staff") throw new UserError("That account is not a staff account.");
  }

  try {
    switch (body.action) {
      case "create": {
        const email = clean(body.email).toLowerCase();
        const password = typeof body.password === "string" ? body.password : "";
        const full_name = clean(body.full_name, 120);
        if (!isEmail(email)) throw new UserError("Enter a valid email address.");
        if (!full_name) throw new UserError("Full name is required.");
        if (password.length < 8) throw new UserError("The password must be at least 8 characters.");

        const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
        if (error) throw new UserError(error.message);
        const { error: pErr } = await sb.from("profiles").upsert(
          { id: data.user.id, email, role: "staff", full_name, phone: clean(body.phone, 40) || null, is_active: true },
          { onConflict: "id" }
        );
        if (pErr) {
          await sb.auth.admin.deleteUser(data.user.id); // do not leave a half-created account
          throw new UserError("Could not create the staff profile.");
        }
        return res.status(200).json({ id: data.user.id });
      }

      case "update_own_profile": {
        const id = auth.user.id;
        const full_name = clean(body.full_name, 120);
        const email = clean(body.email).toLowerCase();
        const phone = clean(body.phone, 40);
        const role = body.role;
        const is_active = body.is_active;
        if (!full_name) throw new UserError("Full name is required.");
        if (!isEmail(email)) throw new UserError("Enter a valid email address.");
        if (!["admin", "staff", "viewer"].includes(role)) throw new UserError("Choose a valid role.");
        if (typeof is_active !== "boolean") throw new UserError("Choose a valid account status.");

        const { data: current, error: currentError } = await sb
          .from("profiles")
          .select("email,is_active")
          .eq("id", id)
          .maybeSingle();
        if (currentError || !current) throw new UserError("Could not load your current profile.");

        const { error: authUpdateError } = await sb.auth.admin.updateUserById(id, {
          email,
          email_confirm: true,
          ban_duration: is_active ? "none" : "876000h",
        });
        if (authUpdateError) throw new UserError(authUpdateError.message);

        const { error: profileUpdateError } = await sb
          .from("profiles")
          .update({ full_name, email, phone: phone || null, role, is_active })
          .eq("id", id);
        if (profileUpdateError) {
          const { error: rollbackError } = await sb.auth.admin.updateUserById(id, {
            email: current.email || auth.user.email,
            email_confirm: true,
            ban_duration: current.is_active ? "none" : "876000h",
          });
          if (rollbackError) {
            throw new UserError("Your profile could not be saved and your email could not be restored. Contact an administrator.");
          }
          throw new UserError("Could not save your profile changes.");
        }
        return res.status(200).json({ ok: true });
      }

      case "update": {
        await requireStaff(body.id);
        const id = clean(body.id, 64);
        const full_name = clean(body.full_name, 120);
        const email = clean(body.email).toLowerCase();
        if (!full_name) throw new UserError("Full name is required.");
        if (!isEmail(email)) throw new UserError("Enter a valid email address.");

        const attrs = { email, email_confirm: true };
        if (typeof body.password === "string" && body.password) {
          if (body.password.length < 8) throw new UserError("The password must be at least 8 characters.");
          attrs.password = body.password;
        }
        const { error } = await sb.auth.admin.updateUserById(id, attrs);
        if (error) throw new UserError(error.message);
        const { error: pErr } = await sb.from("profiles").update({ full_name, email, phone: clean(body.phone, 40) || null }).eq("id", id);
        if (pErr) throw new UserError("Could not update the staff profile.");
        return res.status(200).json({ ok: true });
      }

      case "set_active": {
        await requireStaff(body.id);
        const id = clean(body.id, 64);
        const active = body.is_active === true;
        // Banning also stops the person from logging in at all.
        const { error } = await sb.auth.admin.updateUserById(id, { ban_duration: active ? "none" : "876000h" });
        if (error) throw new UserError(error.message);
        await sb.from("profiles").update({ is_active: active }).eq("id", id);
        return res.status(200).json({ ok: true });
      }

      case "delete": {
        await requireStaff(body.id);
        const { error } = await sb.auth.admin.deleteUser(clean(body.id, 64));
        if (error) throw new UserError(error.message);
        return res.status(200).json({ ok: true });
      }

      default:
        return res.status(400).json({ error: "Unknown action." });
    }
  } catch (err) {
    if (err instanceof UserError) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: "Something went wrong on the server." });
  }
}
