import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    role: 'admin' | 'user' | 'inspector';
}

// Route guard for authenticated routes (dashboards, etc.)
export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    const { isAuthenticated, role: userRole } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to home page if not authenticated
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (role !== userRole) {
        // If authenticated but wrong role, redirect to their correct dashboard
        const dashboardPath = `/${userRole}/dashboard`;
        return <Navigate to={dashboardPath} replace />;
    }

    return <>{children}</>;
};

// Route guard for public routes (login pages)
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated) {
        if (role === 'admin' || role === 'inspector') {
            const dashboardPath = `/${role}/dashboard`;
            return <Navigate to={dashboardPath} replace />;
        }
        if (role === 'user' && window.location.pathname === '/') {
            return <>{children}</>;
        }
        const dashboardPath = `/${role}/dashboard`;
        return <Navigate to={dashboardPath} replace />;
    }

    return <>{children}</>;
};