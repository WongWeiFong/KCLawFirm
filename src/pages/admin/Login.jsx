import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { isConfigured } from "../../lib/supabase.js";

export default function Login() {
  usePageTitle("Admin login");
  const { signIn, session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch {
      // Same message for every failure so the form does not reveal which accounts exist.
      setError("Invalid email or password.");
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card form" onSubmit={submit}>
        <h1>Admin login</h1>
        {!isConfigured && <p className="error-text" role="alert">The backend is not configured yet. See the README.</p>}
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </Field>
        <Field label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        {error && <p className="error-text" role="alert">{error}</p>}
        <button className="btn gold" type="submit" disabled={busy || !isConfigured}>{busy ? "Signing in..." : "Sign in"}</button>
        <Link to="/">Back to website</Link>
      </form>
    </div>
  );
}
