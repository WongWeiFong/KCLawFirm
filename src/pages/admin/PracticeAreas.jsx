import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { deletePractice, listAllPractice, setPracticeActive } from "../../services/practice.js";
import { saveOrder } from "../../services/ordering.js";

export default function AdminPracticeAreas() {
  usePageTitle("Manage practice areas");
  const { data, loading, error, reload } = useAsync(listAllPractice);
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
    const ids = data.map((a) => a.id);
    const t = i + dir;
    if (t < 0 || t >= ids.length) return;
    [ids[i], ids[t]] = [ids[t], ids[i]];
    run(() => saveOrder("practice_areas", ids), "Order updated.");
  };

  const remove = (a) => {
    if (!window.confirm(`Delete "${a.name}"? This cannot be undone.`)) return;
    run(() => deletePractice(a.id), "Practice area deleted.");
  };

  return (
    <>
      <div className="page-head">
        <h1>Practice areas</h1>
        <Link className="btn gold" to="/admin/practice-areas/new">Add practice area</Link>
      </div>
      {message && <p role="status" className="note">{message}</p>}
      {loading && <Loading />}
      {error && <ErrorNote />}
      {data && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Name</th><th>Group</th><th>Status</th><th><span className="sr">Actions</span></th></tr></thead>
            <tbody>
              {data.map((a, i) => (
                <tr key={a.id}>
                  <td className="actions">
                    <button className="link-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${a.name} up`}>&uarr;</button>
                    <button className="link-btn" onClick={() => move(i, 1)} disabled={i === data.length - 1} aria-label={`Move ${a.name} down`}>&darr;</button>
                  </td>
                  <td>{a.name}<br /><span className="meta">/practice/{a.slug}</span></td>
                  <td>{a.category}</td>
                  <td><span className={`badge ${a.is_active ? "published" : "draft"}`}>{a.is_active ? "Active" : "Hidden"}</span></td>
                  <td className="actions">
                    <Link to={`/admin/practice-areas/${a.id}/edit`}>Edit</Link>
                    <button className="link-btn" onClick={() => run(() => setPracticeActive(a.id, !a.is_active), a.is_active ? "Practice area hidden." : "Practice area shown.")}>
                      {a.is_active ? "Hide" : "Show"}
                    </button>
                    <button className="link-btn danger" onClick={() => remove(a)}>Delete</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="5">No practice areas yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
