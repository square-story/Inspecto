import { Route, Routes } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import InspectorLoginPage from "../pages/inspector/InspectorLoginPage";
import InspectorDashboard from "../pages/inspector/InspectorDashboard";
import InspectorRegister from "../pages/inspector/InspectorRegister";
import InspectorOTPVerification from "../pages/inspector/VerifyOTP";
import DetailedForm from "../pages/inspector/DataRegisteration";
import EarningsOverview from "@/pages/inspector/EarningsOverview";
import InspectorDashBoardHome from "@/features/inspector/dashboard/InspectorDashBoard/Home";
import ProfileSettings from "@/pages/inspector/InspectorProfile";
import InspectorSettings from "@/features/inspector/settings";
import AddressManagment from "@/features/inspector/settings/AddressManagement";
import DocumentManagment from "@/features/inspector/settings/DocumentManagment";
import SlotManagment from "@/features/inspector/settings/SlotManagment";
import InspectionsAssigned from "@/pages/inspector/InspectionsAssigned";
import InspectionReportPage from "@/pages/inspector/InspectionReport";

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
            <Route path="inspection" element={<InspectionsAssigned />} />
            <Route path="inspection/:id" element={<InspectionReportPage />} />
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
