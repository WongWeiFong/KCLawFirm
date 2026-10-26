import { Link, useParams } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import Initials from "../components/Initials.jsx";
import NotFound from "./NotFound.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { CONTACT, LAWYERS } from "../data/content.js";

export default function LawyerDetail() {
  const { id } = useParams();
  const lawyer = LAWYERS.find((l) => l.id === id);
  usePageTitle(lawyer?.name);
  if (!lawyer) return <NotFound />;

  const subject = encodeURIComponent(`Enquiry for ${lawyer.name}`);

  return (
    <>
      <section className="block">
        <div className="wrap">
          <p className="crumb"><Link to="/lawyers">Our lawyers</Link> / {lawyer.name}</p>
          <div className="two">
            <div>
              <h1>{lawyer.name}</h1>
              <p className="meta">{lawyer.role}, {lawyer.years} years in practice</p>
              {lawyer.bio.map((p, i) => <p key={i}>{p}</p>)}
              <h2>Education and admission</h2>
              <ul className="plain">
                {lawyer.education.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
            <aside className="side">
              <Initials name={lawyer.name} />
              <h3>Practice focus</h3>
              <p>{lawyer.area}</p>
              <a className="btn gold" href={`mailto:${CONTACT.email}?subject=${subject}`}>
                Email {lawyer.name.split(" ")[0]}
              </a>
            </aside>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
