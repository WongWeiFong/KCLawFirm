import { Link } from "react-router-dom";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listAllArticles } from "../../services/articles.js";
import { listAllLawyers } from "../../services/lawyers.js";
import { listAllOffices } from "../../services/office.js";

export default function Dashboard() {
  usePageTitle("Admin overview");
  const { data, loading, error } = useAsync(async () => {
    const [articles, lawyers, offices] = await Promise.all([listAllArticles(), listAllLawyers(), listAllOffices()]);
    return { articles, lawyers, offices };
  });

  if (loading) return <Loading />;
  if (error) return <ErrorNote />;

  const { articles, lawyers, offices } = data;
  const published = articles.filter((a) => a.status === "published").length;
  const stats = [
    { label: "Published articles", value: published, to: "/admin/articles" },
    { label: "Draft articles", value: articles.length - published, to: "/admin/articles" },
    { label: "Active lawyers", value: lawyers.filter((l) => l.is_active).length, to: "/admin/lawyers" },
    { label: "Offices", value: offices.length, to: "/admin/office" },
  ];

  return (
    <>
      <h1>Overview</h1>
      <div className="grid stats">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card">
            <span className="stat">{s.value}</span>
            <p>{s.label}</p>
          </Link>
        ))}
      </div>
      <h2>Quick actions</h2>
      <div className="btns">
        <Link className="btn gold" to="/admin/articles/new">New article</Link>
        <Link className="btn line" to="/admin/lawyers/new">Add lawyer</Link>
        <Link className="btn line" to="/admin/office">Edit office information</Link>
      </div>
    </>
  );
}
