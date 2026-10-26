import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="block">
      <div className="wrap">
        <h1>Page not found</h1>
        <p>That page does not exist. Try the menu or return home.</p>
        <Link className="btn line" to="/">Go to home</Link>
      </div>
    </section>
  );
}
