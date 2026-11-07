import { useState } from "react";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import { useSite } from "../../context/SiteContext.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";
import { lines, telHref, waHref } from "../../lib/format.js";

export default function Contact() {
  usePageTitle("Contact");
  const { settings, offices, loading, error } = useSite();
  const [index, setIndex] = useState(0);
  const total = offices.length;
  const office = offices[Math.min(index, Math.max(total - 1, 0))];

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const q = office ? encodeURIComponent(office.map_query || lines(office.address).join(", ")) : "";

  return (
    <section className="block">
      <div className="wrap">
        <h1>Contact</h1>
        {loading && <Loading />}
        {error && <ErrorNote />}
        {!loading && !error && !office && <p>Office information will appear here soon.</p>}

        {office && (
          <>
            <p>Choose the office nearest to you. Use the buttons to switch between our offices.</p>
            {total > 1 && (
              <div className="office-nav">
                <button className="btn line" onClick={prev} aria-label="Previous office">&larr; Previous</button>
                <div className="office-title" aria-live="polite">
                  <h2>{office.name}</h2>
                  <span className="meta">Office {index + 1} of {total}</span>
                </div>
                <button className="btn line" onClick={next} aria-label="Next office">Next &rarr;</button>
              </div>
            )}
            {total === 1 && <h2>{office.name}</h2>}

            <div className="two even" key={office.id}>
              <ul className="contact-list">
                {office.phones?.length > 0 && (
                  <li>
                    <b>Phone</b>
                    {office.phones.map((p) => <span key={p} className="line-item"><a href={telHref(p)}>{p}</a></span>)}
                  </li>
                )}
                {office.fax && <li><b>Fax</b>{office.fax}</li>}
                {office.email && <li><b>Email</b><a href={`mailto:${office.email}`}>{office.email}</a></li>}
                {settings.whatsapp && (
                  <li><b>WhatsApp</b><a href={waHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer">Start a chat</a></li>
                )}
                <li><b>Office address</b>{lines(office.address).map((l) => <span key={l} className="line-item">{l}</span>)}</li>
                {settings.business_hours && <li><b>Business hours</b>{settings.business_hours}</li>}
              </ul>
              <div>
                <iframe
                  className="map"
                  title={`Map showing the ${office.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${q}&output=embed`}
                />
                <p><a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
              </div>
            </div>
            <p className="note">Please do not send confidential details by email before we have confirmed we can act for you.</p>
          </>
        )}
      </div>
    </section>
  );
}
