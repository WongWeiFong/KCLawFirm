import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { deleteLawyer, listAllLawyers, saveLawyerOrder, setLawyerActive } from "../../services/lawyers.js";

export default function AdminLawyers() {
  usePageTitle("Manage lawyers");
  const { data, loading, error, reload } = useAsync(listAllLawyers);
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

  const move = (index, dir) => {
    const ids = data.map((l) => l.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => saveLawyerOrder(ids), "Order updated.");
  };

  const remove = (l) => {
    if (!window.confirm(`Delete ${l.name}? This cannot be undone.`)) return;
    run(() => deleteLawyer(l.id), "Lawyer deleted.");
  };

  return (
    <>
      <div className="page-head">
        <h1>Lawyers</h1>
        <Link className="btn gold" to="/admin/lawyers/new">Add lawyer</Link>
      </div>
      {message && <p role="status" className="note">{message}</p>}
      {loading && <Loading />}
      {error && <ErrorNote />}
      {data && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Order</th><th>Name</th><th>Status</th><th><span className="sr">Actions</span></th></tr>
            </thead>
            <tbody>
              {data.map((l, i) => (
                <tr key={l.id}>
                  <td className="actions">
                    <button className="link-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${l.name} up`}>&uarr;</button>
                    <button className="link-btn" onClick={() => move(i, 1)} disabled={i === data.length - 1} aria-label={`Move ${l.name} down`}>&darr;</button>
                  </td>
                  <td>{l.name}<br /><span className="meta">{l.position}</span></td>
                  <td><span className={`badge ${l.is_active ? "published" : "draft"}`}>{l.is_active ? "Active" : "Inactive"}</span></td>
                  <td className="actions">
                    <Link to={`/admin/lawyers/${l.id}/edit`}>Edit</Link>
                    <button className="link-btn" onClick={() => run(() => setLawyerActive(l.id, !l.is_active), l.is_active ? "Lawyer disabled." : "Lawyer enabled.")}>
                      {l.is_active ? "Disable" : "Enable"}
                    </button>
                    <button className="link-btn danger" onClick={() => remove(l)}>Delete</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan="4">No lawyers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
