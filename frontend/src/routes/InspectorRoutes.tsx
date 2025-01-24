import { Route } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import InspectorLoginPage from "../pages/inspector/InspectorLoginPage";
import InspectorDashboard from "../pages/inspector/InspectorDashboard";
import InspectorRegister from "../pages/inspector/InspectorRegister";
import InspectorOTPVerification from "../pages/inspector/VerifyOTP";
import DetailedForm from "../pages/inspector/DataRegisteration";

const InspectorRoutes = () => (
    <>
        <Route path="/inspector/login" element={<PublicRoute><InspectorLoginPage /></PublicRoute>} />
        <Route path="/inspector/register" element={<PublicRoute><InspectorRegister /></PublicRoute>} />
        <Route path="/inspector/verify-otp" element={<PublicRoute><InspectorOTPVerification /></PublicRoute>} />
        <Route path="/inspector/dashboard/*" element={<ProtectedRoute role="inspector"><InspectorDashboard /></ProtectedRoute>} />
        <Route path="/inspector/form-fill/*" element={<ProtectedRoute role="inspector"><DetailedForm /></ProtectedRoute>} />
    </>
);

export default InspectorRoutes;
