import { Route, Routes } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/user/UserLoginPage";
import UserDashboard from "../pages/user/UserDashboard";
import UserRegister from "../pages/user/UserRegister";
import UserInputOTP from "../pages/user/UserInputOTP";
import ResetPasswordPreview from "../pages/user/ResetPassword";

const UserRoutes = () => (
    <Routes>
        <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><UserRegister /></PublicRoute>} />
        <Route path="verify-otp" element={<PublicRoute><UserInputOTP /></PublicRoute>} />
        <Route path="reset-password" element={<PublicRoute><ResetPasswordPreview /></PublicRoute>} />
        <Route path="dashboard/*" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
    </Routes>
);

export default UserRoutes;
