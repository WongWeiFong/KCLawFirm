import { Link } from "react-router-dom";
import { CONTACT } from "../data/content.js";

export default function Cta({
  title = "Talk to a lawyer",
  text = "Call, email or message us on WhatsApp. We reply within one working day.",
}) {
  return (
    <section className="block soft">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="btns">
          <a className="btn gold" href={`tel:${CONTACT.tel}`}>
            Call {CONTACT.phone}
          </a>
          <a className="btn line" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>
          <Link className="btn line" to="/contact">
            All contact details
          </Link>
        </div>
      </div>
    </section>
  );
}
