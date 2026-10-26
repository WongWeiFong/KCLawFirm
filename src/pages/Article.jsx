import { Link, useParams } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import NotFound from "./NotFound.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { ARTICLES } from "../data/content.js";

export default function Article() {
  const { id } = useParams();
  const article = ARTICLES.find((a) => a.id === id);
  usePageTitle(article?.title);
  if (!article) return <NotFound />;

  return (
    <>
      <article className="block">
        <div className="wrap narrow">
          <p className="crumb"><Link to="/insights">Insights</Link> / {article.category}</p>
          <h1 className="h1-article">{article.title}</h1>
          <p className="meta">{article.date}, {article.readTime} read</p>
          {article.body.map((p, i) => <p key={i}>{p}</p>)}
          <p className="note">This article is general information only. Speak to a lawyer about your own situation.</p>
          <Link className="btn line" to="/insights">Back to insights</Link>
        </div>
      </article>
      <Cta />
    </>
  );
}
