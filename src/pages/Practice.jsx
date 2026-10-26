import { useState } from "react";
import { Link } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { PRACTICE_AREAS } from "../data/content.js";

const FILTERS = [
  { key: "All", label: "All" },
  { key: "Core", label: "Core practices" },
  { key: "Other", label: "Other practice areas" },
];

export default function Practice() {
  usePageTitle("Practice areas");
  const [group, setGroup] = useState("All");
  const list = PRACTICE_AREAS.filter((a) => group === "All" || a.group === group);

  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>Practice areas</h1>
          <p>Our three core practices are corporate, litigation and property. We also advise in related areas.</p>
          <div className="chips" role="group" aria-label="Filter practice areas">
            {FILTERS.map((f) => (
              <button key={f.key} className="chip" aria-pressed={group === f.key} onClick={() => setGroup(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid">
            {list.map((a) => (
              <Link key={a.id} to={`/practice/${a.id}`} className="card">
                <h3>{a.name}</h3>
                <p>{a.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
