import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/common/HomePage";
import FAQPage from "../pages/common/FAQPage";
import ContactPage from "../pages/common/ContactPage";
import { PublicRoute } from "./ProtectedRoute";
import UserForget from "../pages/user/ForgetPasswordPreview";
import ResetPasswordPreview from "@/pages/user/ResetPassword";
import NotMatch from "@/pages/common/NotMatch";

const PublicRoutes = () => (
    <Routes>
        <Route path="/" element={
            <PublicRoute>
                <HomePage />
            </PublicRoute>
        } />
        <Route path="/questions" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/forget/:role" element={<PublicRoute><UserForget /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPreview /></PublicRoute>} />

        <Route path="*" element={<NotMatch />} />
    </Routes>
);

export default PublicRoutes;
