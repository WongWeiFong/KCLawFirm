import { useState } from "react";
import Field from "../../components/common/Field.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { changePassword } from "../../services/auth.js";
import { formatDate } from "../../lib/format.js";

export default function Profile() {
  usePageTitle("My profile");
  const { user, profile, isAdmin } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (next.length < 8) return setMsg({ type: "error", text: "The new password must be at least 8 characters." });
    if (next !== confirm) return setMsg({ type: "error", text: "The new passwords do not match." });
    if (next === current) return setMsg({ type: "error", text: "Choose a password different from the current one." });
    setBusy(true);
    try {
      await changePassword(user.email, current, next);
      setCurrent(""); setNext(""); setConfirm("");
      setMsg({ type: "ok", text: "Your password has been changed." });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
    setBusy(false);
  }

  const rows = [
    ["Full name", profile?.full_name || "-"],
    ["Email", user?.email],
    ["Phone", profile?.phone || "-"],
    ["Role", isAdmin ? "Administrator" : "Staff"],
    ["Status", profile?.is_active === false ? "Inactive" : "Active"],
    ["Account created", formatDate(profile?.created_at) || "-"],
  ];

  return (
    <>
      <h1>My profile</h1>
      <ul className="contact-list info">
        {rows.map(([label, value]) => (
          <li key={label}><b>{label}</b>{value}</li>
        ))}
      </ul>
      <p className="note">To change your name, phone or email, ask an administrator.</p>

      <h2>Change password</h2>
      <form className="form" onSubmit={submit}>
        <Field label="Current password">
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
        </Field>
        <Field label="Confirm new password">
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
        </Field>
        {msg.text && <p role={msg.type === "error" ? "alert" : "status"} className={msg.type === "error" ? "error-text" : "note"}>{msg.text}</p>}
        <div className="btns"><button className="btn gold" type="submit" disabled={busy}>{busy ? "Saving..." : "Change password"}</button></div>
      </form>
    </>
  );
}
