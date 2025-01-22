import { UserRole } from "./types";

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    inspector: '/inspector/dashboard',
    user: '/'
}
