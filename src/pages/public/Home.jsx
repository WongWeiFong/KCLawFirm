import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import Avatar from "../../components/common/Avatar.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listPublished } from "../../services/articles.js";
import { listActiveLawyers } from "../../services/lawyers.js";
import { listActivePractice } from "../../services/practice.js";
import { formatDate, telHref } from "../../lib/format.js";

const COUNT_WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six"];
const joinList = (items) => new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(items);

export default function Home() {
  usePageTitle("");
  const { settings, offices } = useSite();
  const articles = useAsync(listPublished);
  const practice = useAsync(listActivePractice);
  const lawyers = useAsync(listActiveLawyers);

  const shortName = settings.firm_name.split(/ (?=Advocates)/)[0];
  const towns = offices.map((o) => o.name.replace(/\s+office$/i, ""));
  const where = towns.length ? ` with ${towns.length > 1 ? "offices" : "an office"} in ${joinList(towns)}` : "";

  const areas = practice.data || [];
  const featured = (areas.some((a) => a.category === "Core") ? areas.filter((a) => a.category === "Core") : areas).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Clear legal advice for businesses, families and property owners.</h1>
            <p className="lead">
              {shortName} is a law firm{where}. We explain your options in plain language and act for you with care.
            </p>
            <div className="btns">
              <Link className="btn gold" to="/contact">Contact the firm</Link>
              <Link className="btn line" to="/practice">See practice areas</Link>
            </div>
          </div>
          {offices.length > 0 && (
            <aside className="frame" aria-label="Our offices">
              <p className="frame-title">
                {COUNT_WORDS[offices.length] || offices.length} {offices.length === 1 ? "office" : "offices"}
              </p>
              <ul>
                {offices.map((o) => (
                  <li key={o.id}>
                    <strong>{o.name}</strong>
                    {o.phones?.[0] ? <a href={telHref(o.phones[0])}>{o.phones[0]}</a> : o.email}
                  </li>
                ))}
                {settings.business_hours && (
                  <li><strong>Business hours</strong>{settings.business_hours}</li>
                )}
              </ul>
            </aside>
          )}
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <h2>Where we can help</h2>
          {practice.loading && <Loading />}
          {practice.error && <ErrorNote />}
          <div className="grid">
            {featured.map((a) => (
              <Link key={a.id} to={`/practice/${a.slug}`} className="card">
                <h3>{a.name}</h3>
                <p>{a.short}</p>
              </Link>
            ))}
          </div>
          <p className="more"><Link to="/practice">View all practice areas</Link></p>
        </div>
      </section>

      {lawyers.data?.length > 0 && (
        <section className="block soft">
          <div className="wrap">
            <h2>Our team</h2>
            <div className="grid">
              {lawyers.data.slice(0, 4).map((l) => (
                <Link key={l.id} to={`/lawyers/${l.id}`} className="card">
                  <Avatar name={l.name} src={l.photo_url} />
                  <h3>{l.name}</h3>
                  <p>{l.position}</p>
                </Link>
              ))}
            </div>
            <p className="more"><Link to="/lawyers">Meet the whole team</Link></p>
          </div>
        </section>
      )}

      <section className="block">
        <div className="wrap">
          <h2>Latest articles</h2>
          {articles.loading && <Loading />}
          {articles.error && <ErrorNote />}
          {articles.data?.length === 0 && <p>No articles have been published yet.</p>}
          <div className="grid">
            {articles.data?.slice(0, 3).map((a) => (
              <Link key={a.id} to={`/articles/${a.slug}`} className="card">
                <span className="meta">{formatDate(a.published_at)}</span>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
              </Link>
            ))}
          </div>
          {articles.data?.length > 0 && <p className="more"><Link to="/articles">All articles</Link></p>}
        </div>
      </section>
      <Cta />
    </>
  );
}
