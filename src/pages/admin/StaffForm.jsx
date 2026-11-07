import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { Loading } from "../../components/common/Status.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { createStaff, getStaff, setStaffActive, updateStaff } from "../../services/staff.js";

const EMPTY = { full_name: "", email: "", phone: "", password: "", is_active: true };

export default function StaffForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  usePageTitle(editing ? "Edit staff" : "Add staff");

  const [form, setForm] = useState(EMPTY);
  const [wasActive, setWasActive] = useState(true);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    getStaff(id)
      .then((s) => {
        if (!s) return setError("Staff account not found.");
        setForm({ full_name: s.full_name || "", email: s.email || "", phone: s.phone || "", password: "", is_active: s.is_active });
        setWasActive(s.is_active);
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

    setSaving(true);
    try {
      const values = { full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password };
      if (editing) {
        await updateStaff(id, values);
        if (form.is_active !== wasActive) await setStaffActive(id, form.is_active);
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
        <Field label="Email (used to log in)"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></Field>
        <Field label="Phone"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field
          label={editing ? "New password (optional)" : "Initial password"}
          hint={editing ? "Leave blank to keep the current password." : "At least 8 characters. Share it securely; the staff member can change it under My profile."}
        >
          <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" required={!editing} />
        </Field>
        {editing && (
          <label className="check">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
            Active (inactive staff cannot log in)
          </label>
        )}
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="btns">
          <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create staff account"}</button>
          <Link className="btn line" to="/admin/staff">Cancel</Link>
        </div>
      </form>
    </>
  );
}
