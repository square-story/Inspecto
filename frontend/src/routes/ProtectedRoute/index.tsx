import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "./types";
import { ROLE_DASHBOARD_PATHS } from "./guards";
import React from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    role: UserRole;
    allowedRoles?: UserRole[]; // Optional: Allow multiple roles to access a route
}

export const ProtectedRoute = ({
    children,
    role,
    allowedRoles
}: ProtectedRouteProps) => {
    const { isAuthenticated, role: userRole } = useSelector(
        (state: RootState) => state.auth
    );
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate
            to={"/"}
            state={{ from: location, message: "please login to access this page" }}
            replace
        />;
    }

    // Handle role checking
    const hasPermission = allowedRoles
        ? userRole !== null && allowedRoles.includes(userRole)
        : role === userRole;

    if (!hasPermission) {
        if (userRole === null) {
            return <Navigate
                to={"/"}
                state={{
                    from: location,
                    message: 'You do not have permission to access this page'
                }}
                replace
            />;
        }

        const dashboardPath = ROLE_DASHBOARD_PATHS[userRole];
        return <Navigate
            to={dashboardPath}
            state={{
                from: location,
                message: 'You do not have permission to access this page'
            }}
            replace
        />;
    }
    return <>{children}</>;
}

interface PublicRouteProps {
    children: React.ReactNode;
    allowAuthenticated?: boolean; // Optional: Allow authenticated users to access some public routes
}

export const PublicRoute = ({
    children,
    allowAuthenticated = false
}: PublicRouteProps) => {
    const { isAuthenticated, role } = useSelector(
        (state: RootState) => state.auth
    );
    const location = useLocation();

    if (isAuthenticated && !allowAuthenticated) {
        // Special case for users on homepage
        if (role === 'user' && location.pathname === '/') {
            return <>{children}</>;
        }

        const dashboardPath = role ? ROLE_DASHBOARD_PATHS[role] : "/";
        return <Navigate
            to={dashboardPath}
            state={{ from: location }}
            replace
        />;
    }

    return <>{children}</>;
};