import { Route } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => (
    <>
        <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
        <Route path="/admin/dashboard/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
    </>
);

export default AdminRoutes;
