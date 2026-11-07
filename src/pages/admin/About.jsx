import { useEffect, useState } from "react";
import Field from "../../components/common/Field.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { getPage, savePage } from "../../services/pages.js";
import { lines } from "../../lib/format.js";

export default function AdminAbout() {
  usePageTitle("Edit About us");
  const { data, loading, error } = useAsync(() => getPage("about"));
  const [form, setForm] = useState({ title: "About the firm", body: "", items_title: "", items: "" });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm({ title: data.title, body: data.body || "", items_title: data.items_title || "", items: (data.items || []).join("\n") });
  }, [data]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.title.trim()) return setMsg("A page title is required.");
    setSaving(true);
    try {
      await savePage("about", {
        title: form.title.trim(), body: form.body, items_title: form.items_title.trim() || null, items: lines(form.items),
      });
      setMsg("About us page saved.");
    } catch {
      setMsg("Could not save. Check your connection and permissions.");
    }
    setSaving(false);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorNote />;

  return (
    <>
      <h1>About us</h1>
      <form className="form" onSubmit={submit}>
        <Field label="Page title"><input value={form.title} onChange={(e) => set("title", e.target.value)} required /></Field>
        <Field label="Introduction" hint="Leave a blank line between paragraphs.">
          <textarea rows="10" value={form.body} onChange={(e) => set("body", e.target.value)} />
        </Field>
        <Field label="List heading" hint="For example: How we work. Leave blank to hide the heading."><input value={form.items_title} onChange={(e) => set("items_title", e.target.value)} /></Field>
        <Field label="List items" hint="One per line. Leave empty to hide the list.">
          <textarea rows="6" value={form.items} onChange={(e) => set("items", e.target.value)} />
        </Field>
        {msg && <p role="status" className="note">{msg}</p>}
        <div className="btns"><button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : "Save page"}</button></div>
      </form>
    </>
  );
}
