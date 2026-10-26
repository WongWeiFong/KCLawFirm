import Cta from "../components/Cta.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { FAQS } from "../data/content.js";

export default function Faq() {
  usePageTitle("FAQ");
  return (
    <>
      <section className="block">
        <div className="wrap narrow">
          <h1>Frequently asked questions</h1>
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <Cta title="Still have a question?" />
    </>
  );
}
