import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken !== null; // User is authenticated if there's an access token
};
interface IsAuthorized {
    (role: string): boolean;
}

const isAuthorized: IsAuthorized = (role) => {
    const userRole = localStorage.getItem("role");
    return userRole === role; // Check if the user's role matches the required role
};
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    role: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    if (!isAuthenticated()) {
        return <Navigate to={`${role}/login`} />; // Redirect to login if not authenticated
    }

    if (!isAuthorized(role)) {
        return <Navigate to={`${role}/login`} />; // Redirect to login if not authorized for the role
    }
    return children
}

export default ProtectedRoute