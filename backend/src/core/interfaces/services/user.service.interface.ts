import { IUsers } from "../../../models/user.model";
import { ChangePasswordResponse } from "../../../services/inspector.service";
import { IUserDashboardStats } from "../../types/user.dashboard.stats.type";

export interface IUserService {
    changePassword(currentPassword: string, newPassword: string, userId: string): Promise<ChangePasswordResponse>;
    toggleStatus(userId: string): Promise<IUsers>;
    getUserDashboard(userId: string): Promise<IUserDashboardStats>;
    getUserById(userId: string): Promise<IUsers | null>;
    getAllUsers(): Promise<IUsers[]>;
    updateUser(userId: string, data: Partial<IUsers>): Promise<IUsers | null>;
}