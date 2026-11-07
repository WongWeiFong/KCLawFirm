import { Link } from "react-router-dom";
import { useSite } from "../../context/SiteContext.jsx";
import { telHref, waHref } from "../../lib/format.js";

export default function Cta({
  title = "Talk to a lawyer",
  text = "Call, email or message us. We reply within one working day.",
}) {
  const { settings, offices } = useSite();
  const phone = offices[0]?.phones?.[0];
  return (
    <section className="block soft">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="btns">
          {phone && <a className="btn gold" href={telHref(phone)}>Call {phone}</a>}
          {settings.whatsapp && (
            <a className="btn line" href={waHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          )}
          <Link className="btn line" to="/contact">Our offices</Link>
        </div>
      </div>
    </section>
  );
}
