import { Link, useParams } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import NotFound from "./NotFound.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { getPublishedBySlug } from "../../services/articles.js";
import { formatDate, paragraphs, readTime } from "../../lib/format.js";

export default function ArticleDetails() {
  const { slug } = useParams();
  const { data: a, loading, error } = useAsync(() => getPublishedBySlug(slug), [slug]);
  usePageTitle(a?.title);

  if (loading) return <div className="wrap block"><Loading /></div>;
  if (error) return <div className="wrap block"><ErrorNote /></div>;
  if (!a) return <NotFound />; // drafts are hidden by the database, so they also land here

  return (
    <>
      <article className="block">
        <div className="wrap narrow">
          <p className="crumb"><Link to="/articles">Articles</Link> / {a.title}</p>
          <h1 className="h1-article">{a.title}</h1>
          <p className="meta">
            {formatDate(a.published_at)}{a.author ? `, by ${a.author}` : ""}, {readTime(a.content)} read
          </p>
          {a.image_url && <img className="article-img" src={a.image_url} alt="" />}
          {paragraphs(a.content).map((p, i) => <p key={i}>{p}</p>)}
          <p className="note">This article is general information only. Speak to a lawyer about your own situation.</p>
          <Link className="btn line" to="/articles">Back to articles</Link>
        </div>
      </article>
      <Cta />
    </>
  );
}
