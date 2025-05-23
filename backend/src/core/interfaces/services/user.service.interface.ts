import { IUsers } from "../../../models/user.model";
import { ChangePasswordResponse } from "../../../services/inspector.service";
import { IBaseService } from "./base/base.service.interface";
import { IUserDashboardStats } from "../../types/user.dashboard.stats.type";

export interface IUserService extends IBaseService<IUsers> {
    changePassword(currentPassword: string, newPassword: string, userId: string): Promise<ChangePasswordResponse>;
    toggleStatus(userId: string): Promise<IUsers>;
    getUserDashboard(userId: string): Promise<IUserDashboardStats>;
}