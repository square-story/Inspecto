import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import InspectorRoutes from "./InspectorRoutes";
import BlockedAccount from "@/pages/BlockedAccount";
import { PublicRoute } from "./ProtectedRoute";
import SupportPage from "@/pages/SupportPage";

const IndexRoutes = () => (
    <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/inspector/*" element={<InspectorRoutes />} />
        {/*
        Blocked routes
        */}
        <Route path="/blocked-account" element={<BlockedAccount />} />
        <Route path="/support" element={<PublicRoute allowBlocked={true} >
            <SupportPage />
        </PublicRoute>} />
        <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
);

export default IndexRoutes;
