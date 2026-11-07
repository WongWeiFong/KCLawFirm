import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { Loading } from "../../components/common/Status.jsx";
import ImageUpload from "../../components/admin/ImageUpload.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { createLawyer, getLawyer, updateLawyer } from "../../services/lawyers.js";
import { lines } from "../../lib/format.js";

const EMPTY = {
  name: "", position: "", photo_url: null, biography: "", practice_areas: "", education: "",
  qualifications: "", email: "", phone: "", display_order: "", is_active: true,
};

export default function LawyerForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  usePageTitle(editing ? "Edit lawyer" : "Add lawyer");

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    getLawyer(id)
      .then((l) => {
        if (!l) return setError("Lawyer not found.");
        setForm({
          name: l.name, position: l.position || "", photo_url: l.photo_url, biography: l.biography || "",
          practice_areas: (l.practice_areas || []).join("\n"), education: (l.education || []).join("\n"),
          qualifications: (l.qualifications || []).join("\n"), email: l.email || "", phone: l.phone || "",
          display_order: l.display_order ?? "", is_active: l.is_active,
        });
      })
      .catch(() => setError("Could not load the lawyer."))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Full name is required.");
    const payload = {
      name: form.name.trim(),
      position: form.position.trim() || null,
      photo_url: form.photo_url || null,
      biography: form.biography.trim() || null,
      practice_areas: lines(form.practice_areas),
      education: lines(form.education),
      qualifications: lines(form.qualifications),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      display_order: form.display_order === "" ? null : Number(form.display_order),
      is_active: form.is_active,
    };
    setSaving(true);
    try {
      if (editing) await updateLawyer(id, { ...payload, display_order: payload.display_order ?? 0 });
      else await createLawyer(payload);
      navigate("/admin/lawyers");
    } catch {
      setError("Could not save the lawyer. Check your connection and permissions.");
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <h1>{editing ? "Edit lawyer" : "Add lawyer"}</h1>
      <form className="form" onSubmit={submit}>
        <Field label="Full name"><input value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
        <Field label="Position / designation"><input value={form.position} onChange={(e) => set("position", e.target.value)} /></Field>
        <ImageUpload label="Profile photo" folder="lawyers" value={form.photo_url} onChange={(v) => set("photo_url", v)} />
        <Field label="Biography" hint="Leave a blank line between paragraphs.">
          <textarea rows="7" value={form.biography} onChange={(e) => set("biography", e.target.value)} />
        </Field>
        <Field label="Practice areas" hint="One per line. For the practice area pages to list this lawyer, use the exact name, for example Litigation.">
          <textarea rows="3" value={form.practice_areas} onChange={(e) => set("practice_areas", e.target.value)} />
        </Field>
        <Field label="Education" hint="One per line.">
          <textarea rows="3" value={form.education} onChange={(e) => set("education", e.target.value)} />
        </Field>
        <Field label="Professional qualifications and bar admission" hint="One per line.">
          <textarea rows="3" value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} />
        </Field>
        <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Phone"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Display order" hint="Lower numbers appear first. Leave blank to add at the end. You can also reorder from the list.">
          <input type="number" min="0" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
        </Field>
        <label className="check">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
          Active (shown on the website)
        </label>
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="btns">
          <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : "Save lawyer"}</button>
          <Link className="btn line" to="/admin/lawyers">Cancel</Link>
        </div>
      </form>
    </>
  );
}
