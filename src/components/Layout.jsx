import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FIRM, FULL, OFFICES } from "../data/content.js";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About us" },
  { to: "/practice", label: "Practice areas" },
  { to: "/lawyers", label: "Our lawyers" },
  { to: "/insights", label: "Insights" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link to="/" className="logo">
          {FIRM}
          <small>Advocates & Solicitors</small>
        </Link>
        <button
          className="burger"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="main-nav" className={open ? "open" : ""} aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div>
          <strong>{FULL}</strong>
          <br />
          This website provides general information and is not legal advice.
          <br />© 2026 {FIRM}.
        </div>
        {OFFICES.map((o) => (
          <div key={o.id}>
            <strong>{o.name}</strong>
            <br />
            <a href={`tel:${o.phones[0].tel}`}>{o.phones[0].display}</a>
            <br />
            <a href={`mailto:${o.email}`}>{o.email}</a>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
