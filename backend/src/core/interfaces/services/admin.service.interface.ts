import { IAdmin } from "../../../models/admin.model";
import { IInspector } from "../../../models/inspector.model";
import { IUsers } from "../../../models/user.model";
import { IAdminDashboardStats } from "../../types/admin.dasboard.stats.type";

export interface PaginationParams {
    page: number;
    limit: number;
    search?: string;
    isListed?: boolean;
}

export interface PaginatedResult<T> {
    users: T[];
    total: number;
}



export interface IAdminService {
    findByEmail(email: string): Promise<IAdmin | null>;
    getAllInspectors(params: PaginationParams): Promise<PaginatedResult<IInspector>>;
    getAllUsers(params: PaginationParams): Promise<PaginatedResult<IUsers>>;
    getAdminDashboardStats(): Promise<IAdminDashboardStats>;
}