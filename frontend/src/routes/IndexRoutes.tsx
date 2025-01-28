import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import InspectorRoutes from "./InspectorRoutes";

const IndexRoutes = () => (
    <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/inspector/*" element={<InspectorRoutes />} />
        <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
);

export default IndexRoutes;
