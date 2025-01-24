import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import InspectorRoutes from "./InspectorRoutes";

const IndexRoutes = () => (
    <Routes>
        <PublicRoutes />
        <UserRoutes />
        <AdminRoutes />
        <InspectorRoutes />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default IndexRoutes;
