import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/lawyers", label: "Lawyers" },
  { to: "/admin/office", label: "Office information" },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Keep the admin area out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  async function logout() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link to="/admin" className="logo">Admin</Link>
        <p className="meta">{user?.email}</p>
        <nav aria-label="Admin">
          <ul>
            {LINKS.map((l) => (
              <li key={l.to}><NavLink to={l.to} end={l.end}>{l.label}</NavLink></li>
            ))}
          </ul>
        </nav>
        <Link to="/" className="side-link">View website</Link>
        <button className="btn line" onClick={logout}>Log out</button>
      </aside>
      <main className="admin-main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
