import { Route, Routes } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import InspectorLoginPage from "../pages/inspector/InspectorLoginPage";
import InspectorDashboard from "../pages/inspector/InspectorDashboard";
import InspectorRegister from "../pages/inspector/InspectorRegister";
import InspectorOTPVerification from "../pages/inspector/VerifyOTP";
import DetailedForm from "../pages/inspector/DataRegisteration";
import EarningsOverview from "@/pages/inspector/EarningsOverview";
import InspectorDashBoardHome from "@/app/InspectorDashBoard/Home";
import ProfileSettings from "@/pages/inspector/InspectorProfile";
import InspectorSettings from "@/app/InspectorSettings";
import AddressManagment from "@/app/InspectorSettings/AddressManagement";
import DocumentManagment from "@/app/InspectorSettings/DocumentManagment";
import SlotManagment from "@/app/InspectorSettings/SlotManagment";

const InspectorRoutes = () => (
    <Routes>
        <Route path="login" element={<PublicRoute><InspectorLoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><InspectorRegister /></PublicRoute>} />
        <Route path="verify-otp" element={<PublicRoute><InspectorOTPVerification /></PublicRoute>} />
        <Route
            path="dashboard/*"
            element={
                <ProtectedRoute role="inspector">
                    <InspectorDashboard />
                </ProtectedRoute>
            }
        >
            <Route path="" element={<InspectorDashBoardHome />} />
            <Route path="earnings" element={<EarningsOverview />} />
            <Route path="settings" element={<ProfileSettings />}>
                <Route path="" element={<InspectorSettings />} />
                <Route path="address" element={<AddressManagment />} />
                <Route path="slot" element={<SlotManagment />} />
                <Route path="document" element={<DocumentManagment />} />
            </Route>

        </Route>
        <Route path="form-fill/*" element={<ProtectedRoute role="inspector"><DetailedForm /></ProtectedRoute>} />
    </Routes>
);

export default InspectorRoutes;
