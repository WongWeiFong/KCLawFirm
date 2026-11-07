import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listPublished } from "../../services/articles.js";
import { formatDate } from "../../lib/format.js";

export default function Articles() {
  usePageTitle("Articles");
  const { data, loading, error } = useAsync(listPublished);
  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>Articles</h1>
          <p>Short guides and news. They are general information and not legal advice for your situation.</p>
          {loading && <Loading />}
          {error && <ErrorNote />}
          {data && data.length === 0 && <p>No articles have been published yet.</p>}
          <div className="grid">
            {data?.map((a) => (
              <Link key={a.id} to={`/articles/${a.slug}`} className="card">
                {a.image_url && <img className="thumb" src={a.image_url} alt="" loading="lazy" />}
                <span className="meta">{formatDate(a.published_at)}{a.author ? `, ${a.author}` : ""}</span>
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
