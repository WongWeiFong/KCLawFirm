import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { formatDate } from "../../lib/format.js";

export default function Profile() {
  usePageTitle("My profile");
  const { user, profile, isAdmin } = useAuth();

  const rows = [
    ["Full name", profile?.full_name || "-"],
    ["Email", profile?.email || user?.email || "-"],
    ["Phone", profile?.phone || "-"],
    ["Role", isAdmin ? "Administrator" : "Staff"],
    ["Status", profile?.is_active === false ? "Inactive" : "Active"],
    ["Account created", formatDate(profile?.created_at) || "-"],
  ];

  return (
    <>
      <div className="page-head profile-head">
        <div>
          <p className="profile-eyebrow">ACCOUNT</p>
          <h1>My profile</h1>
          <p className="meta">Your personal account information.</p>
        </div>
        <Link className="btn gold" to="/admin/profile/edit">Edit profile</Link>
      </div>
      <dl className="profile-summary">
        {rows.map(([label, value]) => (
          <div className="profile-detail" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
