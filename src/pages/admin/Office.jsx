import { useEffect, useState } from "react";
import Field from "../../components/common/Field.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { deleteOffice, getSettings, listAllOffices, saveOffice, saveSettings } from "../../services/office.js";
import { lines } from "../../lib/format.js";

function SettingsForm({ initial, onSaved }) {
  const s = initial || {};
  const social = s.social_links || {};
  const [form, setForm] = useState({
    firm_name: s.firm_name || "", whatsapp: s.whatsapp || "", business_hours: s.business_hours || "",
    facebook: social.facebook || "", instagram: social.instagram || "", linkedin: social.linkedin || "",
  });
  const [msg, setMsg] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await saveSettings({
        firm_name: form.firm_name.trim(),
        whatsapp: form.whatsapp.trim() || null,
        business_hours: form.business_hours.trim() || null,
        social_links: { facebook: form.facebook.trim(), instagram: form.instagram.trim(), linkedin: form.linkedin.trim() },
      });
      setMsg("Firm details saved.");
      onSaved();
    } catch {
      setMsg("Could not save. Check your permissions.");
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <Field label="Firm name"><input value={form.firm_name} onChange={(e) => set("firm_name", e.target.value)} required /></Field>
      <Field label="Business hours"><input value={form.business_hours} onChange={(e) => set("business_hours", e.target.value)} /></Field>
      <Field label="WhatsApp number" hint="Digits with country code, for example 60123456789. Leave blank to hide the WhatsApp buttons.">
        <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
      </Field>
      <Field label="Facebook page URL"><input type="url" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} /></Field>
      <Field label="Instagram URL"><input type="url" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
      <Field label="LinkedIn URL"><input type="url" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></Field>
      {msg && <p role="status" className="note">{msg}</p>}
      <div className="btns"><button className="btn gold" type="submit">Save firm details</button></div>
    </form>
  );
}



function OfficeForm({ office, onDone }) {
  const o = office || {};
  const [form, setForm] = useState({
    name: o.name || "", address: o.address || "", phones: (o.phones || []).join("\n"), fax: o.fax || "",
    email: o.email || "", map_query: o.map_query || "", display_order: o.display_order ?? 0, is_active: o.is_active ?? true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.address.trim()) return setError("Office name and address are required.");
    setSaving(true);
    try {
      await saveOffice(o.id, {
        name: form.name.trim(), address: form.address.trim(), phones: lines(form.phones), fax: form.fax.trim() || null,
        email: form.email.trim() || null, map_query: form.map_query.trim() || null,
        display_order: Number(form.display_order) || 0, is_active: form.is_active,
      });
      onDone();
    } catch {
      setError("Could not save the office.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${o.name}? This cannot be undone.`)) return;
    try {
      await deleteOffice(o.id);
      onDone();
    } catch {
      setError("Could not delete the office.");
    }
  }

  return (
    <form className="form boxed" onSubmit={submit}>
      <Field label="Office name"><input value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
      <Field label="Address" hint="One line per row of the address.">
        <textarea rows="5" style={{ resize: "vertical" }} value={form.address} onChange={(e) => set("address", e.target.value)} required />
      </Field>
      <Field label="Phone numbers" hint="One per line.">
        <textarea rows="3" style={{ resize: "vertical" }} value={form.phones} onChange={(e) => set("phones", e.target.value)} />
        </Field>
      <Field label="Fax"><input value={form.fax} onChange={(e) => set("fax", e.target.value)} /></Field>
      <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <Field label="Map search text" hint="Used for the Google Map, for example the building, street and town.">
        <input value={form.map_query} onChange={(e) => set("map_query", e.target.value)} />
      </Field>
      <Field label="Display order" hint="Lower numbers appear first on the Contact page.">
        <input type="number" value={form.display_order} onChange={(e) => set("display_order", e.target.value)} />
      </Field>
      <label className="check"><input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Active (shown on the website)</label>
      {error && <p className="error-text" role="alert">{error}</p>}
      <div className="btns">
        <button className="btn gold" type="submit" disabled={saving}>{saving ? "Saving..." : "Save office"}</button>
        <button type="button" className="btn line" onClick={onDone}>Cancel</button>
        {o.id && <button type="button" className="btn line danger-btn" onClick={remove}>Delete office</button>}
      </div>
    </form>
  );
}

export default function Office() {
  usePageTitle("Office information");
  const settings = useAsync(getSettings);
  const offices = useAsync(listAllOffices);
  const [editing, setEditing] = useState(null); // office id, "new" or null

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const done = () => { setEditing(null); offices.reload(); };

  return (
    <>
      <h1>Office information</h1>
      <h2>Firm details</h2>
      {settings.loading && <Loading />}
      {settings.error && <ErrorNote />}
      {!settings.loading && !settings.error && <SettingsForm initial={settings.data} onSaved={settings.reload} />}

      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2.5rem 0" }}>
        <span style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--gold, #b9975b))" }} />
        <span style={{ color: "var(--gold, #b9975b)", fontSize: "1.1rem" }}>✦</span>
        <span style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, var(--gold, #b9975b))" }} />
      </div>

      <div className="page-head">
        <h2>Offices</h2>
        {editing !== "new" && <button className="btn gold" onClick={() => setEditing("new")}>Add office</button>}
      </div>
      {offices.loading && <Loading />}
      {offices.error && <ErrorNote />}
      {editing === "new" && <OfficeForm onDone={done} />}
      {offices.data?.map((o) => (
        <div key={o.id} className="office-row">
          <div className="page-head">
            <div>
              <strong>{o.name}</strong> <span className={`badge ${o.is_active ? "published" : "draft"}`}>{o.is_active ? "Active" : "Inactive"}</span>
              <br /><span className="meta">{o.email}</span>
            </div>
            {editing !== o.id && <button className="btn line" onClick={() => setEditing(o.id)}>Edit</button>}
          </div>
          {editing === o.id && <OfficeForm office={o} onDone={done} />}
        </div>
      ))}
    </>
  );
}
