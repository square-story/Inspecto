import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/user/UserLoginPage";
import UserDashboard from "../pages/user/UserDashboard";
import UserRegister from "../pages/user/UserRegister";
import UserInputOTP from "../pages/user/UserInputOTP";
import SettingsProfile from "@/app/UserDashboard/profile";
import UserDashboardView from "@/app/UserDashboard/dashboard";
import VehicleManagement from "@/app/UserDashboard/VehicleManagment";
import InspectionManagement from "@/app/UserDashboard/InspectionManagement";
import PaymentHistory from "@/app/UserDashboard/PaymentHistory";
import UserReportPage from "@/components/user/ViewReport";

const UserRoutes = () => (
    <Routes>
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><UserRegister /></PublicRoute>} />
        <Route path="verify-otp" element={<PublicRoute><UserInputOTP /></PublicRoute>} />
        <Route path="dashboard/*" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} >
            <Route path="" element={<UserDashboardView />} />
            <Route path="settings" element={<SettingsProfile />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="inspection" element={<InspectionManagement />} />
            <Route path="history" element={<PaymentHistory />} />
            <Route path="report/:id" element={<UserReportPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default UserRoutes;
