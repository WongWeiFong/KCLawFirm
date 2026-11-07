import { Link, useParams } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import Avatar from "../../components/common/Avatar.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import NotFound from "./NotFound.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { getLawyer } from "../../services/lawyers.js";
import { paragraphs, telHref } from "../../lib/format.js";

function List({ title, items }) {
  if (!items?.length) return null;
  return (
    <>
      <h2>{title}</h2>
      <ul className="plain">{items.map((x) => <li key={x}>{x}</li>)}</ul>
    </>
  );
}

export default function LawyerDetail() {
  const { id } = useParams();
  const { data: l, loading, error } = useAsync(() => getLawyer(id), [id]);
  usePageTitle(l?.name);

  if (loading) return <div className="wrap block"><Loading /></div>;
  if (error) return <div className="wrap block"><ErrorNote /></div>;
  // Inactive lawyers are hidden from visitors by the database, so they also land here.
  if (!l || !l.is_active) return <NotFound />;

  return (
    <>
      <section className="block">
        <div className="wrap">
          <p className="crumb"><Link to="/lawyers">Our team</Link> / {l.name}</p>
          <div className="two">
            <div>
              <h1>{l.name}</h1>
              <p className="meta">{l.position}</p>
              {paragraphs(l.biography).map((p, i) => <p key={i}>{p}</p>)}
              <List title="Practice areas" items={l.practice_areas} />
              <List title="Education" items={l.education} />
              <List title="Professional qualifications" items={l.qualifications} />
            </div>
            <aside className="side">
              <Avatar name={l.name} src={l.photo_url} />
              <div className="btns stack">
                {l.phone && <a className="btn gold" href={telHref(l.phone)}>Call {l.name.split(" ")[0]}: {l.phone}</a>}
                {l.email && <a className="btn line" href={`mailto:${l.email}`}>Email {l.name.split(" ")[0]}</a>}
                <Link className="btn line" to="/contact">Contact an office</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
