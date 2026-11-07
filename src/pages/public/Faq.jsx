import Cta from "../../components/public/Cta.jsx";
import { ErrorNote, Loading } from "../../components/common/Status.jsx";
import useAsync from "../../hooks/useAsync.js";
import usePageTitle from "../../hooks/usePageTitle.js";
import { listActiveFaqs } from "../../services/faqs.js";

export default function Faq() {
  usePageTitle("FAQ");
  const { data, loading, error } = useAsync(listActiveFaqs);
  return (
    <>
      <section className="block">
        <div className="wrap narrow">
          <h1>Frequently asked questions</h1>
          {loading && <Loading />}
          {error && <ErrorNote />}
          {data?.length === 0 && <p>No questions have been added yet.</p>}
          {data?.map((f) => (
            <details key={f.id}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <Cta title="Still have a question?" />
    </>
  );
}
