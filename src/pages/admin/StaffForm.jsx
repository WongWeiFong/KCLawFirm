import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { Loading } from "../../components/common/Status.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { createStaff, getStaff, updateStaff } from "../../services/staff.js";
import { LOGIN_EMAIL_PATTERN } from "../../services/auth.js";

const EMPTY = { full_name: "", email: "", phone: "", password: "", role: "staff", is_active: true, created_at: "" };

function dateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export default function StaffForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  usePageTitle(editing ? "Edit staff" : "Add staff");

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    getStaff(id)
      .then((s) => {
        if (!s) return setError("Staff account not found.");
        setForm({
          full_name: s.full_name || "",
          email: s.email || "",
          phone: s.phone || "",
          password: "",
          role: s.role || "staff",
          is_active: s.is_active !== false,
          created_at: dateInputValue(s.created_at),
        });
      })
      .catch(() => setError("Could not load the staff account."))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.full_name.trim() || !form.email.trim()) return setError("Full name and email are required.");
    if (!editing && form.password.length < 8) return setError("The password must be at least 8 characters.");
    if (editing && form.password && form.password.length < 8) return setError("The new password must be at least 8 characters.");
    if (editing && !form.created_at) return setError("Account created date is required.");

    setSaving(true);
    try {
      const values = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
        is_active: form.is_active,
        created_at: form.created_at ? new Date(`${form.created_at}T00:00:00`).toISOString() : undefined,
      };
      if (editing) {
        await updateStaff(id, values);
      } else {
        await createStaff(values);
      }
      navigate("/admin/staff");
    } catch (err) {
      setError(err.message || "Could not save.");
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <h1>{editing ? "Edit staff" : "Add staff"}</h1>
      <form className="form" onSubmit={submit}>
        <Field label="Full name"><input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required /></Field>
        <Field label="Email (used to log in)"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={254} pattern={LOGIN_EMAIL_PATTERN} required /></Field>
        <Field label="Phone"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        {editing && (
          <>
            <Field label="Role">
              <select value={form.role} onChange={(e) => set("role", e.target.value)}>
                <option value="staff">Staff</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Administrator</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={form.is_active ? "active" : "inactive"} onChange={(e) => set("is_active", e.target.value === "active")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
            <Field label="Account created" hint="Changes the profile's recorded date; the original authentication account date is unchanged.">
              <input
                type="date"
                value={form.created_at}
                max={dateInputValue(new Date().toISOString())}
                onChange={(e) => set("created_at", e.target.value)}
                required
              />
            </Field>
            <p className="note">Changing a role can grant or remove access to admin features. Inactive accounts cannot log in.</p>
          </>
        )}
        <Field
          label={editing ? "New password (optional)" : "Initial password"}
          hint={editing ? "Leave blank to keep the current password." : "At least 8 characters. Share it securely; the staff member can change it under My profile."}
        >
          <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" required={!editing} />
        </Field>
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="btns">
          <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create staff account"}</button>
          <Link className="btn line" to="/admin/staff">Cancel</Link>
        </div>
      </form>
    </>
  );
}
