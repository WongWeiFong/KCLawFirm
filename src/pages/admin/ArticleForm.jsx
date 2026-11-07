import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { Loading } from "../../components/common/Status.jsx";
import ImageUpload from "../../components/admin/ImageUpload.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { createArticle, getArticle, updateArticle } from "../../services/articles.js";
import { slugify } from "../../lib/format.js";

const EMPTY = { title: "", slug: "", excerpt: "", content: "", image_url: null, author: "", published_at: "", status: "draft" };

export default function ArticleForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  usePageTitle(editing ? "Edit article" : "New article");

  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(editing);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    getArticle(id)
      .then((a) => {
        if (!a) return setError("Article not found.");
        setForm({
          title: a.title, slug: a.slug, excerpt: a.excerpt || "", content: a.content || "",
          image_url: a.image_url, author: a.author || "", status: a.status,
          published_at: a.published_at ? a.published_at.slice(0, 10) : "",
        });
      })
      .catch(() => setError("Could not load the article."))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  function onTitle(value) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const slug = slugify(form.slug);
    if (!form.title.trim() || !slug || !form.content.trim()) {
      setError("Title, slug and content are required.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      image_url: form.image_url || null,
      author: form.author.trim() || null,
      status: form.status,
      published_at: form.published_at
        ? new Date(form.published_at).toISOString()
        : form.status === "published" ? new Date().toISOString() : null,
    };
    setSaving(true);
    try {
      if (editing) await updateArticle(id, payload);
      else await createArticle(payload);
      navigate("/admin/articles");
    } catch (err) {
      setError(err.code === "23505" ? "That slug is already used by another article." : "Could not save the article. Check your connection and permissions.");
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <h1>{editing ? "Edit article" : "New article"}</h1>
      <form className="form" onSubmit={submit}>
        <Field label="Title"><input value={form.title} onChange={(e) => onTitle(e.target.value)} required /></Field>
        <Field label="Slug" hint="Used in the web address, for example /articles/your-slug">
          <input value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} required />
        </Field>
        <ImageUpload label="Featured image" folder="articles" value={form.image_url} onChange={(v) => set("image_url", v)} />
        <Field label="Summary / excerpt">
          <textarea rows="3" style={{ resize: "vertical" }} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </Field>
        <Field label="Content" hint="Leave a blank line between paragraphs.">
          <textarea rows="14" style={{ resize: "vertical" }} value={form.content} onChange={(e) => set("content", e.target.value)} required />
        </Field>
        <Field label="Author"><input value={form.author} onChange={(e) => set("author", e.target.value)} /></Field>
        <Field label="Publication date"><input type="date" value={form.published_at} onChange={(e) => set("published_at", e.target.value)} /></Field>
        <Field label="Status" hint="Only published articles appear on the website.">
          <select style={{ padding: "10px" }} value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="btns">
          <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : "Save article"}</button>
          <Link className="btn line" to="/admin/articles">Cancel</Link>
        </div>
      </form>
    </>
  );
}
