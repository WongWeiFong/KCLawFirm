import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { getPage } from "../../services/pages.js";
import { paragraphs } from "../../lib/format.js";

export default function About() {
  const { data: page, loading, error } = useAsync(() => getPage("about"));
  const { offices } = useSite();
  usePageTitle(page?.title || "About the firm");

  return (
    <>
      <section className="block">
        <div className="wrap">
          {loading && <Loading />}
          {error && <ErrorNote />}
          {!loading && !error && !page && <p>This page has not been written yet.</p>}
          {page && (
            <>
              <h1>{page.title}</h1>
              <div className="two">
                <div>
                  {paragraphs(page.body).map((p, i) => <p key={i}>{p}</p>)}
                  {page.items?.length > 0 && (
                    <>
                      {page.items_title && <h2>{page.items_title}</h2>}
                      <ul className="plain">{page.items.map((x) => <li key={x}>{x}</li>)}</ul>
                    </>
                  )}
                </div>
                <aside className="side">
                  <h3>At a glance</h3>
                  {offices.map((o) => <p key={o.id} className="meta">{o.name}</p>)}
                  <Link className="btn line" to="/lawyers">Meet our team</Link>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
      <Cta />
    </>
  );
}
