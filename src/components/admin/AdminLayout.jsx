import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/about", label: "About us" },
  { to: "/admin/practice-areas", label: "Practice areas" },
  { to: "/admin/lawyers", label: "Lawyers" },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/faq", label: "FAQ" },
  { to: "/admin/office", label: "Office information" },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="admin-side-header">
          <Link to="/admin" className="logo">Admin</Link>
          <button
            type="button"
            className="admin-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="admin-side-content"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <div id="admin-side-content" className={`admin-side-content${menuOpen ? " is-open" : ""}`}>
          <p className="meta">{user?.email}</p>
          <nav aria-label="Admin">
            <ul>
              {LINKS.map((l) => (
                <li key={l.to}><NavLink to={l.to} end={l.end} onClick={() => setMenuOpen(false)}>{l.label}</NavLink></li>
              ))}
            </ul>
          </nav>
          <div className="admin-side-actions">
            <Link to="/" className="side-link" onClick={() => setMenuOpen(false)}>View website</Link>
            <button className="btn line" onClick={logout}>Log out</button>
          </div>
        </div>
      </aside>
      <main className="admin-main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}
