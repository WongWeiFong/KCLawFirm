import { Link, useParams } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import NotFound from "../NotFound.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { getPracticeBySlug } from "../../services/practice.js";
import { listActiveLawyers } from "../../services/lawyers.js";
import { paragraphs, telHref } from "../../lib/format.js";

export default function PracticeDetail() {
  const { slug } = useParams();
  const { offices } = useSite();
  const { data: area, loading, error } = useAsync(() => getPracticeBySlug(slug), [slug]);
  const { data: lawyers } = useAsync(listActiveLawyers);
  usePageTitle(area?.name);

  if (loading) return <div className="wrap block"><Loading /></div>;
  if (error) return <div className="wrap block"><ErrorNote /></div>;
  if (!area) return <NotFound />;

  const team = (lawyers || []).filter((l) => l.practice_areas?.includes(area.name));
  const phone = offices[0]?.phones?.[0];

  return (
    <>
      <section className="block">
        <div className="wrap">
          <p className="crumb"><Link to="/practice">Practice areas</Link> / {area.name}</p>
          <h1>{area.name}</h1>
          <div className="two">
            <div>
              {paragraphs(area.body).map((p, i) => <p key={i}>{p}</p>)}
              {area.items?.length > 0 && (
                <>
                  <h2>What we handle</h2>
                  <ul className="plain">{area.items.map((x) => <li key={x}>{x}</li>)}</ul>
                </>
              )}
            </div>
            <aside className="side">
              <h3>Speak to us</h3>
              <p className="meta">Tell us about your matter and we will point you to the right lawyer.</p>
              {team.map((l) => (
                <p key={l.id}>
                  <Link to={`/lawyers/${l.id}`}>{l.name}</Link>
                  <br />
                  <span className="meta">{l.position}</span>
                </p>
              ))}
              {phone && <a className="btn gold" href={telHref(phone)}>Call us</a>}
            </aside>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
