import { Link, useParams } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import NotFound from "./NotFound.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listActiveLawyers } from "../../services/lawyers.js";
import { PRACTICE_AREAS } from "../../data/staticContent.js";
import { telHref } from "../../lib/format.js";

export default function PracticeDetail() {
  const { id } = useParams();
  const area = PRACTICE_AREAS.find((a) => a.id === id);
  usePageTitle(area?.name);
  const { offices } = useSite();
  const { data: lawyers } = useAsync(listActiveLawyers);
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
              {area.body.map((p, i) => <p key={i}>{p}</p>)}
              <h2>What we handle</h2>
              <ul className="plain">{area.items.map((x) => <li key={x}>{x}</li>)}</ul>
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
