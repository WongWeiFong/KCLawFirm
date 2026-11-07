import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Lets administrators and active staff into the admin area. This only controls what the
// browser shows; the real protection is the row-level security in the database.
export default function ProtectedRoute() {
  const { session, canAccess, deactivated, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <p className="status center">Checking access...</p>;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!canAccess) {
    return (
      <div className="status center">
        <h1>{deactivated ? "Account deactivated" : "Not authorised"}</h1>
        <p>
          {deactivated
            ? "This account has been deactivated. Please contact an administrator."
            : "This account does not have access to the admin area."}
        </p>
        <button className="btn line" onClick={signOut}>Sign out</button>
      </div>
    );
  }
  return <Outlet />;
}
