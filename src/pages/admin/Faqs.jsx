import { useState } from "react";
import Field from "../../components/common/Field.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { deleteFaq, listAllFaqs, saveFaq, setFaqActive } from "../../services/faqs.js";
import { saveOrder } from "../../services/ordering.js";

function FaqForm({ faq, onDone }) {
  const [form, setForm] = useState({ question: faq?.question || "", answer: faq?.answer || "", is_active: faq?.is_active ?? true });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.question.trim() || !form.answer.trim()) return setError("Question and answer are required.");
    setSaving(true);
    try {
      await saveFaq(faq?.id, { question: form.question.trim(), answer: form.answer.trim(), is_active: form.is_active });
      onDone(true);
    } catch {
      setError("Could not save. Check your connection and permissions.");
      setSaving(false);
    }
  }

  return (
    <form className="form boxed" onSubmit={submit}>
      <Field label="Question"><input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></Field>
      <Field label="Answer"><textarea rows="5" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required /></Field>
      <label className="check">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        Shown on the website
      </label>
      {error && <p className="error-text" role="alert">{error}</p>}
      <div className="btns">
        <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : "Save question"}</button>
        <button type="button" className="btn line" onClick={() => onDone(false)}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminFaqs() {
  usePageTitle("Manage FAQ");
  const { data, loading, error, reload } = useAsync(listAllFaqs);
  const [editing, setEditing] = useState(null); // faq id, "new" or null
  const [message, setMessage] = useState("");

  async function run(action, success) {
    try {
      await action();
      setMessage(success);
      reload();
    } catch {
      setMessage("That change could not be saved.");
    }
  }

  const move = (i, dir) => {
    const ids = data.map((f) => f.id);
    const t = i + dir;
    if (t < 0 || t >= ids.length) return;
    [ids[i], ids[t]] = [ids[t], ids[i]];
    run(() => saveOrder("faqs", ids), "Order updated.");
  };

  const remove = (f) => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    run(() => deleteFaq(f.id), "Question deleted.");
  };

  const done = (saved) => {
    setEditing(null);
    if (saved) { setMessage("Question saved."); reload(); }
  };

  return (
    <>
      <div className="page-head">
        <h1>FAQ</h1>
        {editing !== "new" && <button className="btn gold" onClick={() => setEditing("new")}>Add question</button>}
      </div>
      {message && <p role="status" className="note">{message}</p>}
      {editing === "new" && <FaqForm onDone={done} />}
      {loading && <Loading />}
      {error && <ErrorNote />}
      {data?.length === 0 && <p>No questions yet.</p>}
      {data?.map((f, i) => (
        <div key={f.id} className="office-row">
          <div className="page-head">
            <div>
              <strong>{f.question}</strong> <span className={`badge ${f.is_active ? "published" : "draft"}`}>{f.is_active ? "Shown" : "Hidden"}</span>
              <br /><span className="meta">{f.answer.slice(0, 110)}{f.answer.length > 110 ? "..." : ""}</span>
            </div>
            <div className="actions">
              <button className="link-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">&uarr;</button>
              <button className="link-btn" onClick={() => move(i, 1)} disabled={i === data.length - 1} aria-label="Move down">&darr;</button>
              {editing !== f.id && <button className="link-btn" onClick={() => setEditing(f.id)}>Edit</button>}
              <button className="link-btn" onClick={() => run(() => setFaqActive(f.id, !f.is_active), f.is_active ? "Question hidden." : "Question shown.")}>
                {f.is_active ? "Hide" : "Show"}
              </button>
              <button className="link-btn danger" onClick={() => remove(f)}>Delete</button>
            </div>
          </div>
          {editing === f.id && <FaqForm faq={f} onDone={done} />}
        </div>
      ))}
    </>
  );
}
