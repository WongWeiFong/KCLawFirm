import { Link } from "react-router-dom";
import { CONTACT, OFFICES } from "../data/content.js";

export default function Cta({
  title = "Talk to a lawyer",
  text = "Call, email or message us on WhatsApp. We reply within one working day.",
}) {
  const main = OFFICES[0].phones[0];
  return (
    <section className="block soft">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="btns">
          <a className="btn gold" href={`tel:${main.tel}`}>Call {main.display}</a>
          <a className="btn line" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>
          <Link className="btn line" to="/contact">Our offices</Link>
        </div>
      </div>
    </section>
  );
}
