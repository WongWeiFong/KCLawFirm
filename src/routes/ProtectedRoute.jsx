import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// This only controls what the browser shows. The real protection is the
// row-level security in the database (see supabase/schema.sql).
export default function ProtectedRoute() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <p className="status center">Checking access...</p>;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) {
    return (
      <div className="status center">
        <h1>Not authorised</h1>
        <p>This account does not have administrator access.</p>
        <button className="btn line" onClick={signOut}>Sign out</button>
      </div>
    );
  }
  return <Outlet />;
}
