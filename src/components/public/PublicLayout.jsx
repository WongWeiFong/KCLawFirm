import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SiteProvider, useSite } from "../../context/SiteContext.jsx";
import { telHref } from "../../lib/format.js";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About us" },
  { to: "/practice", label: "Practice areas" },
  { to: "/lawyers", label: "Our lawyers" },
  { to: "/articles", label: "Articles" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const { settings } = useSite();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const [main, rest] = settings.firm_name.split(/ (?=Advocates)/);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link to="/" className="logo">
          {main}
          {rest && <small>{rest}</small>}
        </Link>
        <button className="burger" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav id="main-nav" className={open ? "open" : ""} aria-label="Main">
          <ul>
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const { settings, offices } = useSite();
  const socials = Object.entries(settings.social_links || {}).filter(([, url]) => url);
  return (
    <footer className="site-footer">
      <div className="wrap cols">
        <div>
          <strong>{settings.firm_name}</strong>
          <br />
          This website provides general information and is not legal advice.
          <br />© {new Date().getFullYear()} {settings.firm_name}
          {socials.length > 0 && (
            <p className="socials">
              {socials.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                  {name[0].toUpperCase() + name.slice(1)}
                </a>
              ))}
            </p>
          )}
        </div>
        {offices.map((o) => (
          <div key={o.id}>
            <strong>{o.name}</strong>
            <br />
            {o.phones?.[0] && <a href={telHref(o.phones[0])}>{o.phones[0]}</a>}
            <br />
            {o.email && <a href={`mailto:${o.email}`}>{o.email}</a>}
          </div>
        ))}
      </div>
    </footer>
  );
}

function Shell() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function PublicLayout() {
  return (
    <SiteProvider>
      <Shell />
    </SiteProvider>
  );
}
