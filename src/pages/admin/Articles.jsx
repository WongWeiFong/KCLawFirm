import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { deleteArticle, listAllArticles } from "../../services/articles.js";
import { formatDate } from "../../lib/format.js";

export default function AdminArticles() {
  usePageTitle("Manage articles");
  const { data, loading, error, reload } = useAsync(listAllArticles);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [message, setMessage] = useState("");

  async function remove(a) {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await deleteArticle(a.id);
      setMessage("Article deleted.");
      reload();
    } catch {
      setMessage("Could not delete the article.");
    }
  }

  const rows = (data || []).filter(
    (a) => (status === "all" || a.status === status) && a.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <div className="page-head">
        <h1>Articles</h1>
        <Link className="btn gold" to="/admin/articles/new">New article</Link>
      </div>
      <div className="filters">
        <input type="search" placeholder="Search by title" aria-label="Search articles" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      {message && <p role="status" className="note">{message}</p>}
      {loading && <Loading />}
      {error && <ErrorNote />}
      {data && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Published</th><th><span className="sr">Actions</span></th></tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}<br /><span className="meta">/articles/{a.slug}</span></td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                  <td>{formatDate(a.published_at) || "-"}</td>
                  <td className="actions">
                    <Link to={`/admin/articles/${a.id}/edit`}>Edit</Link>
                    <button className="link-btn danger" onClick={() => remove(a)}>Delete</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan="4">No articles found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
