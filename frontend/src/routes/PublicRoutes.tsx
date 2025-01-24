import { Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FAQPage from "../pages/FAQPage";
import ContactPage from "../pages/ContactPage";

const PublicRoutes = () => (
    <>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
    </>
);

export default PublicRoutes;
