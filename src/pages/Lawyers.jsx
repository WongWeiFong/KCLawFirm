import { Link } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import Initials from "../components/Initials.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { LAWYERS } from "../data/content.js";

export default function Lawyers() {
  usePageTitle("Our lawyers");
  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>Our lawyers</h1>
          <div className="grid">
            {LAWYERS.map((l) => (
              <Link key={l.id} to={`/lawyers/${l.id}`} className="card">
                <Initials name={l.name} />
                <h3>{l.name}</h3>
                <p>{l.role}, {l.area}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
