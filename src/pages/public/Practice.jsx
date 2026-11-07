import { useState } from "react";
import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listActivePractice } from "../../services/practice.js";

const LABELS = { Core: "Core practices", Other: "Other practice areas" };

export default function Practice() {
  usePageTitle("Practice areas");
  const { data, loading, error } = useAsync(listActivePractice);
  const [group, setGroup] = useState("All");

  const categories = ["All", ...new Set((data || []).map((a) => a.category))];
  const list = (data || []).filter((a) => group === "All" || a.category === group);

  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>Practice areas</h1>
          {loading && <Loading />}
          {error && <ErrorNote />}
          {data?.length === 0 && <p>Our practice areas will appear here soon.</p>}
          {categories.length > 2 && (
            <div className="chips" role="group" aria-label="Filter practice areas">
              {categories.map((c) => (
                <button key={c} className="chip" aria-pressed={group === c} onClick={() => setGroup(c)}>
                  {LABELS[c] || c}
                </button>
              ))}
            </div>
          )}
          <div className="grid">
            {list.map((a) => (
              <Link key={a.id} to={`/practice/${a.slug}`} className="card">
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
