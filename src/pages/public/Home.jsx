import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listPublished } from "../../services/articles.js";
import { PRACTICE_AREAS } from "../../data/staticContent.js";
import { formatDate } from "../../lib/format.js";

export default function Home() {
  usePageTitle("");
  const { data: articles, loading, error } = useAsync(listPublished);
  const core = PRACTICE_AREAS.filter((a) => a.group === "Core");

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Clear legal advice for businesses, families and property owners.</h1>
            <p className="lead">
              Tan & Rahman is a law firm with offices in Kuantan and Mentakab, Pahang. We explain your options in plain language and act for you with care.
            </p>
            <div className="btns">
              <Link className="btn gold" to="/contact">Contact the firm</Link>
              <Link className="btn line" to="/practice">See practice areas</Link>
            </div>
          </div>
          <aside className="frame" aria-label="Firm at a glance">
            <p className="frame-title">Two offices</p>
            <ul>
              <li><strong>Kuantan</strong> Sri Kuantan Square</li>
              <li><strong>Mentakab</strong> Jalan Haji Kassim</li>
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
          <h2>Latest articles</h2>
          {loading && <Loading />}
          {error && <ErrorNote />}
          {articles && articles.length === 0 && <p>No articles have been published yet.</p>}
          <div className="grid">
            {articles?.slice(0, 3).map((a) => (
              <Link key={a.id} to={`/articles/${a.slug}`} className="card">
                <span className="meta">{formatDate(a.published_at)}</span>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
