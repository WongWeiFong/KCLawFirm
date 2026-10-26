import { useState } from "react";
import { Link } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { ARTICLES } from "../data/content.js";

const CATEGORIES = ["All", ...new Set(ARTICLES.map((a) => a.category))];

export default function Insights() {
  usePageTitle("Insights");
  const [cat, setCat] = useState("All");
  const list = ARTICLES.filter((a) => cat === "All" || a.category === cat);

  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>Insights</h1>
          <p>Short guides on legal topics. They are general information and not legal advice for your situation.</p>
          <div className="chips" role="group" aria-label="Filter articles">
            {CATEGORIES.map((c) => (
              <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid">
            {list.map((a) => (
              <Link key={a.id} to={`/insights/${a.id}`} className="card">
                <span className="meta">{a.category}, {a.date}, {a.readTime} read</span>
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
