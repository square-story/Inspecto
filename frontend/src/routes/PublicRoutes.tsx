import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FAQPage from "../pages/FAQPage";
import ContactPage from "../pages/ContactPage";
import { PublicRoute } from "./ProtectedRoute";
import UserForget from "../pages/user/ForgetPasswordPreview";
import ResetPasswordPreview from "@/pages/user/ResetPassword";

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
        <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
);

export default PublicRoutes;
