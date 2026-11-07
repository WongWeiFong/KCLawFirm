import { useState } from "react";
import { uploadImage } from "../../services/storage.js";

export default function ImageUpload({ label, value, onChange, folder }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="field">
      <span>{label}</span>
      {value && <img className="preview" src={value} alt="Current upload" />}
      <input type="file" accept="image/*" onChange={pick} disabled={busy} />
      {busy && <small>Uploading...</small>}
      {error && <small className="error-text" role="alert">{error}</small>}
      {value && <button type="button" className="btn line small" onClick={() => onChange(null)}>Remove image</button>}
    </div>
  );
}
