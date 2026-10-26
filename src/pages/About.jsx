import { Link } from "react-router-dom";
import Cta from "../components/Cta.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { FULL } from "../data/content.js";

const PRINCIPLES = [
  "We explain the law and your options in plain language.",
  "We give a fee estimate in writing before work starts.",
  "We tell you when a matter is better settled than fought.",
  "We keep you updated, and return calls within one working day.",
];

export default function About() {
  usePageTitle("About us");
  return (
    <>
      <section className="block">
        <div className="wrap">
          <h1>About us</h1>
          <div className="two">
            <div>
              <p>{FULL} was founded in 1998 by two friends who had trained together and wanted to practise law differently: with fewer surprises for clients.</p>
              <p>Today we are a team of four partners and a small group of associates. We keep the firm focused so the person who advises you is the person who does your work.</p>
              <h2>How we work</h2>
              <ul className="plain">
                {PRINCIPLES.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <aside className="side">
              <h3>At a glance</h3>
              <p className="meta">Founded 1998</p>
              <p className="meta">Kuala Lumpur, Malaysia</p>
              <p className="meta">Admitted to the Malaysian Bar</p>
              <Link className="btn line" to="/lawyers">Meet our lawyers</Link>
            </aside>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
