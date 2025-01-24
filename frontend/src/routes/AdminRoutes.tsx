import { Route, Routes } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => (
    <Routes>
        <Route path="login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
        <Route path="dashboard/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
    </Routes>
);

export default AdminRoutes;
