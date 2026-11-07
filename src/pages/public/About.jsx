import { Link } from "react-router-dom";
import Cta from "../../components/public/Cta.jsx";
import usePageTitle from "../../hooks/usePageTitle.js";

const PRINCIPLES = [
  "We explain the law and your options in plain language.",
  "We give a fee estimate in writing before work starts.",
  "We tell you when a matter is better settled than fought.",
  "We keep you updated, and return calls within one working day.",
];

export default function About() {
  usePageTitle("About the firm");
  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>About the firm</h1>
          <div className="two">
            <div>
              <p>We are a law firm serving clients from our offices in Kuantan and Mentakab, Pahang. We keep the firm focused so the person who advises you is the person who does your work.</p>
              <h2>How we work</h2>
              <ul className="plain">
                {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <aside className="side">
              <h3>At a glance</h3>
              <p className="meta">Offices in Kuantan and Mentakab</p>
              <p className="meta">Pahang Darul Makmur, Malaysia</p>
              <Link className="btn line" to="/lawyers">Meet our team</Link>
            </aside>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
