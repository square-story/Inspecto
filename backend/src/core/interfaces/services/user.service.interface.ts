import { IUsers } from "../../../models/user.model";

export interface IUserService {
    findUserByUserId(userId: string): Promise<IUsers | null>;
    updateUser(userId: string, data: Partial<IUsers>): Promise<IUsers | null>;
    changePassword(currentPassword: string, newPassword: string, userId: string): Promise<{ status: boolean; message: string }>;
}