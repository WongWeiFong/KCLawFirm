import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Practice from "./pages/Practice.jsx";
import PracticeDetail from "./pages/PracticeDetail.jsx";
import Lawyers from "./pages/Lawyers.jsx";
import LawyerDetail from "./pages/LawyerDetail.jsx";
import Insights from "./pages/Insights.jsx";
import Article from "./pages/Article.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/:id" element={<PracticeDetail />} />
        <Route path="lawyers" element={<Lawyers />} />
        <Route path="lawyers/:id" element={<LawyerDetail />} />
        <Route path="insights" element={<Insights />} />
        <Route path="insights/:id" element={<Article />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
