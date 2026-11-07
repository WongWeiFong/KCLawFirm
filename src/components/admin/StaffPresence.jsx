import { useEffect, useState } from "react";
import { listStaffPresence, recordPresence } from "../../services/presence.js";

const ONLINE_WINDOW = 90_000;

function isOnline(lastSeenAt) {
  if (!lastSeenAt) return false;
  const age = Date.now() - new Date(lastSeenAt).getTime();
  return age >= 0 && age < ONLINE_WINDOW;
}

function formatTime(value) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StaffPresence() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        await recordPresence();
        const rows = await listStaffPresence();
        if (active) {
          setStaff(rows || []);
          setError("");
        }
      } catch {
        if (active) setError("Presence is unavailable. Run supabase/migration-5.sql to enable it.");
      } finally {
        if (active) setLoading(false);
      }
    }

    refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const onlineCount = staff.filter((person) => isOnline(person.last_seen_at)).length;

  return (
    <aside className="admin-presence" aria-label="Staff presence">
      <div className="presence-heading">
        <div>
          <p className="profile-eyebrow">TEAM</p>
          <h2>Staff online</h2>
        </div>
        <span className="presence-count" aria-label={`${onlineCount} staff online`}>{onlineCount}</span>
      </div>
      <p className="meta">Online status updates automatically. Administrator accounts are not shown.</p>
      {error && <p className="error-text" role="status">{error}</p>}
      {loading && !error && <p className="meta">Loading staff status...</p>}
      {!loading && !error && staff.length === 0 && <p className="meta">No staff accounts to show.</p>}
      {!error && staff.length > 0 && (
        <ul className="presence-list">
          {staff.map((person) => {
            const online = isOnline(person.last_seen_at);
            return (
              <li className="presence-person" key={person.id}>
                <span className={`presence-dot${online ? " is-online" : ""}`} aria-hidden="true" />
                <div>
                  <strong>{person.full_name || "Staff member"}</strong>
                  <span className="presence-state">{online ? "Online" : "Offline"}</span>
                  <span className="presence-time">Last login: {formatTime(person.last_login_at)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
