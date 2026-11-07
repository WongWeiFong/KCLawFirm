import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { Loading } from "../../components/common/Status.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { createPractice, getPractice, updatePractice } from "../../services/practice.js";
import { lines, slugify } from "../../lib/format.js";

const EMPTY = { name: "", slug: "", short: "", body: "", items: "", category: "Core", display_order: "", is_active: true };

export default function PracticeForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  usePageTitle(editing ? "Edit practice area" : "Add practice area");

  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    getPractice(id)
      .then((a) => {
        if (!a) return setError("Practice area not found.");
        setForm({
          name: a.name, slug: a.slug, short: a.short || "", body: a.body || "", items: (a.items || []).join("\n"),
          category: a.category, display_order: a.display_order ?? "", is_active: a.is_active,
        });
      })
      .catch(() => setError("Could not load the practice area."))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onName = (v) => setForm((f) => ({ ...f, name: v, slug: slugTouched ? f.slug : slugify(v) }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    const slug = slugify(form.slug);
    if (!form.name.trim() || !slug) return setError("Name and slug are required.");
    const payload = {
      name: form.name.trim(), slug, short: form.short.trim() || null, body: form.body, items: lines(form.items),
      category: form.category, display_order: form.display_order === "" ? null : Number(form.display_order), is_active: form.is_active,
    };
    setSaving(true);
    try {
      if (editing) await updatePractice(id, { ...payload, display_order: payload.display_order ?? 0 });
      else await createPractice(payload);
      navigate("/admin/practice-areas");
    } catch (err) {
      setError(err.code === "23505" ? "That slug is already used by another practice area." : "Could not save. Check your connection and permissions.");
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <h1>{editing ? "Edit practice area" : "Add practice area"}</h1>
      <form className="form" onSubmit={submit}>
        <Field label="Name" hint="Lawyers are listed on this page when their practice areas include this exact name.">
          <input value={form.name} onChange={(e) => onName(e.target.value)} required />
        </Field>
        <Field label="Slug" hint="Used in the web address, for example /practice/litigation">
          <input value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} required />
        </Field>
        <Field label="Group">
          <select value={form.category} onChange={(e) => set("category", e.target.value)}>
            <option value="Core">Core practice</option>
            <option value="Other">Other practice area</option>
          </select>
        </Field>
        <Field label="Short description" hint="Shown on the cards."><textarea rows="2" value={form.short} onChange={(e) => set("short", e.target.value)} /></Field>
        <Field label="Full description" hint="Leave a blank line between paragraphs.">
          <textarea rows="9" value={form.body} onChange={(e) => set("body", e.target.value)} />
        </Field>
        <Field label="What we handle" hint="One per line.">
          <textarea rows="6" value={form.items} onChange={(e) => set("items", e.target.value)} />
        </Field>
        <Field label="Display order" hint="Lower numbers appear first. Leave blank to add at the end.">
          <input type="number" min="0" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
        </Field>
        <label className="check">
          <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
          Shown on the website
        </label>
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="btns">
          <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : "Save practice area"}</button>
          <Link className="btn line" to="/admin/practice-areas">Cancel</Link>
        </div>
      </form>
    </>
  );
}
