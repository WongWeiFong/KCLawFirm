import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/public/PublicLayout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminOnlyRoute from "./routes/AdminOnlyRoute.jsx";

import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Practice from "./pages/public/Practice.jsx";
import PracticeDetail from "./pages/public/PracticeDetail.jsx";
import Lawyers from "./pages/public/Lawyers.jsx";
import LawyerDetail from "./pages/public/LawyerDetail.jsx";
import Articles from "./pages/public/Articles.jsx";
import ArticleDetails from "./pages/public/ArticleDetails.jsx";
import Faq from "./pages/public/Faq.jsx";
import Contact from "./pages/public/Contact.jsx";
import NotFound from "./pages/public/NotFound.jsx";

import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminArticles from "./pages/admin/Articles.jsx";
import ArticleForm from "./pages/admin/ArticleForm.jsx";
import AdminLawyers from "./pages/admin/Lawyers.jsx";
import LawyerForm from "./pages/admin/LawyerForm.jsx";
import Office from "./pages/admin/Office.jsx";
import AdminAbout from "./pages/admin/About.jsx";
import AdminPracticeAreas from "./pages/admin/PracticeAreas.jsx";
import PracticeForm from "./pages/admin/PracticeForm.jsx";
import AdminFaqs from "./pages/admin/Faqs.jsx";
import Profile from "./pages/admin/Profile.jsx";
import ProfileEdit from "./pages/admin/ProfileEdit.jsx";
import Staff from "./pages/admin/Staff.jsx";
import StaffForm from "./pages/admin/StaffForm.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/:slug" element={<PracticeDetail />} />
        <Route path="lawyers" element={<Lawyers />} />
        <Route path="lawyers/:id" element={<LawyerDetail />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:slug" element={<ArticleDetails />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin area */}
      <Route path="admin/login" element={<Login />} />
      <Route path="admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/:id/edit" element={<ArticleForm />} />
          <Route path="lawyers" element={<AdminLawyers />} />
          <Route path="lawyers/new" element={<LawyerForm />} />
          <Route path="lawyers/:id/edit" element={<LawyerForm />} />
          <Route path="practice-areas" element={<AdminPracticeAreas />} />
          <Route path="practice-areas/new" element={<PracticeForm />} />
          <Route path="practice-areas/:id/edit" element={<PracticeForm />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="faq" element={<AdminFaqs />} />
          <Route path="office" element={<Office />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route element={<AdminOnlyRoute />}>
            <Route path="staff" element={<Staff />} />
            <Route path="staff/new" element={<StaffForm />} />
            <Route path="staff/:id/edit" element={<StaffForm />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
