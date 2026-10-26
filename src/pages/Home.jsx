import { Link } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { ARTICLES, PRACTICE_AREAS } from "../data/content.js";

export default function Home() {
  usePageTitle("");
  const core = PRACTICE_AREAS.filter((a) => a.group === "Core");

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Clear legal advice for businesses, families and property owners.</h1>
            <p className="lead">
              Tan & Rahman is a Kuala Lumpur law firm. We explain your options in plain language and act for you with care.
            </p>
            <div className="btns">
              <Link className="btn gold" to="/contact">Contact the firm</Link>
              <Link className="btn line" to="/practice">See practice areas</Link>
            </div>
          </div>
          <aside className="frame" aria-label="Firm at a glance">
            <p className="frame-title">Since 1998</p>
            <ul>
              <li><strong>4 partners</strong> each leading a practice area</li>
              <li><strong>3 languages</strong> English, Bahasa Malaysia and Mandarin</li>
              <li><strong>1 working day</strong> to reply to every enquiry</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2>Where we can help</h2>
          <div className="grid">
            {core.map((a) => (
              <Link key={a.id} to={`/practice/${a.id}`} className="card">
                <h3>{a.name}</h3>
                <p>{a.short}</p>
              </Link>
            ))}
          </div>
          <p className="more"><Link to="/practice">View all practice areas</Link></p>
        </div>
      </section>

      <section className="block soft">
        <div className="wrap">
          <h2>Latest from our lawyers</h2>
          <div className="grid">
            {ARTICLES.slice(0, 3).map((a) => (
              <Link key={a.id} to={`/insights/${a.id}`} className="card">
                <span className="meta">{a.category}, {a.date}</span>
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
