import usePageTitle from "../hooks/usePageTitle.js";
import { CONTACT } from "../data/content.js";

export default function Contact() {
  usePageTitle("Contact");
  const q = encodeURIComponent(CONTACT.mapQuery);

  return (
    <section className="block">
      <div className="wrap">
        <h1>Contact</h1>
        <p>Call, email or message us. We reply within one working day.</p>
        <div className="two even">
          <ul className="contact-list">
            <li><b>Phone</b><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></li>
            <li><b>Email</b><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            <li>
              <b>WhatsApp</b>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">Start a chat</a>
            </li>
            <li>
              <b>Office address</b>
              {CONTACT.address.map((line) => <span key={line}>{line}<br /></span>)}
            </li>
            <li><b>Office hours</b>{CONTACT.hours}</li>
          </ul>
          <div>
            <iframe
              className="map"
              title="Map showing the office location"
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
