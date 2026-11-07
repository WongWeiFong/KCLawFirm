import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { deleteStaff, listStaff, setStaffActive } from "../../services/staff.js";
import { formatDate } from "../../lib/format.js";

export default function Staff() {
  usePageTitle("Manage staff");
  const { data, loading, error, reload } = useAsync(listStaff);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [message, setMessage] = useState("");

  async function run(action, success) {
    try {
      await action();
      setMessage(success);
      reload();
    } catch (err) {
      setMessage(err.message || "That change could not be saved.");
    }
  }

  const remove = (s) => {
    if (!window.confirm(`Delete ${s.full_name || s.email}? Their login will be removed permanently.`)) return;
    run(() => deleteStaff(s.id), "Staff account deleted.");
  };

  const rows = (data || []).filter((s) => {
    const text = `${s.full_name || ""} ${s.email || ""}`.toLowerCase();
    const okStatus = status === "all" || (status === "active" ? s.is_active : !s.is_active);
    return okStatus && text.includes(q.toLowerCase());
  });

  return (
    <>
      <div className="page-head">
        <h1>Staff</h1>
        <Link className="btn gold" to="/admin/staff/new">Add staff</Link>
      </div>
      <p className="note">Staff can manage website content and their own password. They cannot manage other accounts.</p>
      <div className="filters">
        <input type="search" placeholder="Search by name or email" aria-label="Search staff" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: "320px", maxWidth: "100%" }} />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {message && <p role="status" className="note">{message}</p>}
      {loading && <Loading />}
      {error && <ErrorNote />}
      {data && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Phone</th><th>Status</th><th>Added</th><th><span className="sr">Actions</span></th></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.full_name || "-"}<br /><span className="meta">{s.email}</span></td>
                  <td>{s.phone || "-"}</td>
                  <td><span className={`badge ${s.is_active ? "published" : "draft"}`}>{s.is_active ? "Active" : "Inactive"}</span></td>
                  <td>{formatDate(s.created_at)}</td>
                  <td className="actions">
                    <Link to={`/admin/staff/${s.id}/edit`}>Edit</Link>
                    {/* <button className="link-btn" onClick={() => run(() => setStaffActive(s.id, !s.is_active), s.is_active ? "Staff deactivated." : "Staff activated.")}>
                      {s.is_active ? "Deactivate" : "Activate"}
                    </button> */}
                    <button className="link-btn danger" onClick={() => remove(s)}>Delete</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan="5">No staff found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
