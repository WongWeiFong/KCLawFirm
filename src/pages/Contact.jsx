import { useState } from "react";
import usePageTitle from "../hooks/usePageTitle.js";
import { CONTACT, OFFICES } from "../data/content.js";

export default function Contact() {
  usePageTitle("Contact");
  const [index, setIndex] = useState(0);
  const total = OFFICES.length;
  const office = OFFICES[index];
  const q = encodeURIComponent(office.mapQuery);

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="block">
      <div className="wrap">
        <h1>Contact</h1>
        <p>Choose the office nearest to you. Use the buttons to switch between our offices.</p>

        <div className="office-nav">
          <button className="btn line" onClick={prev} aria-label="Previous office">
            &larr; Previous
          </button>
          <div className="office-title" aria-live="polite">
            <h2>{office.name}</h2>
            <span className="meta">Office {index + 1} of {total}</span>
          </div>
          <button className="btn line" onClick={next} aria-label="Next office">
            Next &rarr;
          </button>
        </div>

        <div className="two even" key={office.id}>
          <ul className="contact-list">
            <li>
              <b>Phone</b>
              {office.phones.map((p) => (
                <span key={p.tel} className="line-item">
                  <a href={`tel:${p.tel}`}>{p.display}</a>
                </span>
              ))}
            </li>
            {office.fax && (
              <li><b>Fax</b>{office.fax}</li>
            )}
            <li><b>Email</b><a href={`mailto:${office.email}`}>{office.email}</a></li>
            <li>
              <b>WhatsApp</b>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">Start a chat</a>
            </li>
            <li>
              <b>Office address</b>
              {office.address.map((line) => <span key={line} className="line-item">{line}</span>)}
            </li>
            <li><b>Office hours</b>{CONTACT.hours}</li>
          </ul>
          <div>
            <iframe
              className="map"
              title={`Map showing the ${office.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${q}&output=embed`}
            />
            <p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </p>
          </div>
        </div>

        <p className="note">Please do not send confidential details by email before we have confirmed we can act for you.</p>
      </div>
    </section>
  );
}
