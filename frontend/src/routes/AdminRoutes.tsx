import { Route, Routes } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDashBoardContent from "@/features/admin/dashboard";
import UserManagement from "@/pages/admin/UserManagement";
import InspectorMangement from "@/pages/admin/InspectorMangement";
import WalletManagement from "@/pages/admin/WalletManagement";
import InspectionTypesManagement from "@/pages/admin/InspectionTypes";

const AdminRoutes = () => (
    <Routes>
        <Route path="login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />
        <Route path="dashboard/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}>
            <Route path="" element={<AdminDashBoardContent />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="inspectors" element={<InspectorMangement />} />
            <Route path="wallet" element={<WalletManagement />} />
            <Route path="inspection-types" element={<InspectionTypesManagement />} />
        </Route>
    </Routes>
);

export default AdminRoutes;
