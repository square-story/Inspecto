import { Route } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/user/UserLoginPage";
import UserDashboard from "../pages/user/UserDashboard";
import UserRegister from "../pages/user/UserRegister";
import UserForget from "../pages/user/ForgetPasswordPreview";
import UserInputOTP from "../pages/user/UserInputOTP";
import ResetPasswordPreview from "../pages/user/ResetPassword";

const UserRoutes = () => (
    <>
        <Route path="/user/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/user/register" element={<PublicRoute><UserRegister /></PublicRoute>} />
        <Route path="/forget/:role" element={<PublicRoute><UserForget /></PublicRoute>} />
        <Route path="/user/verify-otp" element={<PublicRoute><UserInputOTP /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPreview /></PublicRoute>} />
        <Route path="/user/dashboard/*" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
    </>
);

export default UserRoutes;
