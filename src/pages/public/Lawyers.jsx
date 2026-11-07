import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import Avatar from "../../components/common/Avatar.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listActiveLawyers } from "../../services/lawyers.js";

export default function Lawyers() {
  usePageTitle("Our team");
  const { data, loading, error } = useAsync(listActiveLawyers);
  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>Our team</h1>
          {loading && <Loading />}
          {error && <ErrorNote />}
          {data && data.length === 0 && <p>Our team profiles will appear here soon.</p>}
          <div className="grid">
            {data?.map((l) => (
              <Link key={l.id} to={`/lawyers/${l.id}`} className="card">
                <Avatar name={l.name} src={l.photo_url} />
                <h3>{l.name}</h3>
                <p>{l.position}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
