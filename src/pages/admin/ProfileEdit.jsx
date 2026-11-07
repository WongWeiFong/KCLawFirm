import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../../components/common/Field.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { changePassword, updateOwnAdminProfile, updateOwnProfile } from "../../services/auth.js";
import { formatDate } from "../../lib/format.js";

export default function ProfileEdit() {
  usePageTitle("Edit profile");
  const { user, profile, isAdmin, refreshProfile } = useAuth();
  const [details, setDetails] = useState({ full_name: "", email: "", phone: "", role: "staff", is_active: true });
  const [detailsMsg, setDetailsMsg] = useState({ type: "", text: "" });
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    setDetails({
      full_name: profile?.full_name || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      role: profile?.role || "staff",
      is_active: profile?.is_active !== false,
    });
  }, [profile?.full_name, profile?.email, profile?.phone, profile?.role, profile?.is_active, user?.email]);

  async function saveDetails(e) {
    e.preventDefault();
    setDetailsMsg({ type: "", text: "" });
    const full_name = details.full_name.trim();
    const phone = details.phone.trim();
    if (!full_name) return setDetailsMsg({ type: "error", text: "Full name is required." });
    if (full_name.length > 120) return setDetailsMsg({ type: "error", text: "Full name must be 120 characters or fewer." });
    if (phone.length > 40) return setDetailsMsg({ type: "error", text: "Phone must be 40 characters or fewer." });
    const email = details.email.trim().toLowerCase();
    if (isAdmin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setDetailsMsg({ type: "error", text: "Enter a valid email address." });
    }

    setDetailsBusy(true);
    try {
      if (isAdmin) {
        await updateOwnAdminProfile({ full_name, email, phone, role: details.role, is_active: details.is_active });
      } else {
        await updateOwnProfile(user.id, { full_name, phone: phone || null });
      }
      await refreshProfile();
      setDetailsMsg({ type: "ok", text: "Your profile details have been updated." });
    } catch (err) {
      setDetailsMsg({ type: "error", text: err.message || "Could not update your profile details." });
    } finally {
      setDetailsBusy(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    if (next.length < 8) return setPasswordMsg({ type: "error", text: "The new password must be at least 8 characters." });
    if (next !== confirm) return setPasswordMsg({ type: "error", text: "The new passwords do not match." });
    if (next === current) return setPasswordMsg({ type: "error", text: "Choose a password different from the current one." });

    setPasswordBusy(true);
    try {
      await changePassword(profile?.email || user.email, current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setPasswordMsg({ type: "ok", text: "Your password has been changed." });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Could not change your password." });
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <>
      <div className="page-head profile-head">
        <div>
          <p className="profile-eyebrow">ACCOUNT</p>
          <h1>Edit profile</h1>
          <p className="meta">Update your contact details or change your password.</p>
        </div>
        <Link className="btn line" to="/admin/profile">Back to profile</Link>
      </div>

      <section className="profile-section" aria-labelledby="profile-details-heading">
        <h2 id="profile-details-heading">Personal details</h2>
        <p className="meta">{isAdmin ? "You can update your account email, role, and status." : "Only administrators can change your email, role, or status."}</p>
        <form className="form" onSubmit={saveDetails}>
          <Field label="Full name">
            <input value={details.full_name} onChange={(e) => setDetails((d) => ({ ...d, full_name: e.target.value }))} maxLength={120} autoComplete="name" required />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={details.email}
              onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
              autoComplete="email"
              disabled={!isAdmin}
              required
            />
          </Field>
          <Field label="Phone">
            <input type="tel" value={details.phone} onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} maxLength={40} autoComplete="tel" />
          </Field>
          <Field label="Role">
            <select value={details.role} onChange={(e) => setDetails((d) => ({ ...d, role: e.target.value }))} disabled={!isAdmin}>
              <option value="admin">Administrator</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={details.is_active ? "active" : "inactive"}
              onChange={(e) => setDetails((d) => ({ ...d, is_active: e.target.value === "active" }))}
              disabled={!isAdmin}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <Field label="Account created">
            <input value={formatDate(profile?.created_at) || "-"} disabled readOnly/>
          </Field>
          {isAdmin && <p className="note">Changing your role or deactivating your account may remove your access to the admin area.</p>}
          {detailsMsg.text && <p role={detailsMsg.type === "error" ? "alert" : "status"} className={detailsMsg.type === "error" ? "error-text" : "note"}>{detailsMsg.text}</p>}
          <div className="btns">
            <button className="btn gold" type="submit" disabled={detailsBusy}>{detailsBusy ? "Saving..." : "Save details"}</button>
          </div>
        </form>
      </section>
      
      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2.5rem 0" }}>
        <span style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--gold, #b9975b))" }} />
        <span style={{ color: "var(--gold, #b9975b)", fontSize: "1.1rem" }}>✦</span>
        <span style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, var(--gold, #b9975b))" }} />
      </div>

      <section className="profile-section" aria-labelledby="profile-password-heading">
        <h2 id="profile-password-heading">Change password</h2>
        <p className="meta">Choose a new password with at least 8 characters.</p>
        <form className="form" onSubmit={savePassword}>
          <Field label="Current password">
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
          </Field>
          <Field label="New password">
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
          </Field>
          <Field label="Confirm new password">
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
          </Field>
          {passwordMsg.text && <p role={passwordMsg.type === "error" ? "alert" : "status"} className={passwordMsg.type === "error" ? "error-text" : "note"}>{passwordMsg.text}</p>}
          <div className="btns">
            <button className="btn gold" type="submit" disabled={passwordBusy}>{passwordBusy ? "Saving..." : "Change password"}</button>
          </div>
        </form>
      </section>
    </>
  );
}
