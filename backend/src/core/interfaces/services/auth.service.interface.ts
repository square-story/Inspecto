import { IUsers } from "../../../models/user.model";
import { UserRole } from "../../types/user.role.type";

export interface IAuthService {
    login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
}

export interface IInspectorAuthService extends IAuthService {
    registerInspector(email: string, password: string, firstName: string, lastName: string, phone: string): Promise<{ message: string }>;
    verifyOTP(email: string, otp: string): Promise<{ message: string, accessToken: string, refreshToken: string }>;
    resendOTP(email: string): Promise<{ message: string }>
    forgetPassword(email: string, role: UserRole): Promise<{ message: string }>
    resetPassword(token: string, email: string, password: string): Promise<{ message: string }>
    refreshToken(token: string): Promise<{ accessToken: string, status?: boolean, blockReason?: string }>
}

export interface IUserAuthService extends IAuthService {
    googleLoginOrRegister(token: string): Promise<{
        user: IUsers;
        accessToken: string;
        refreshToken: string;
    }>
    verifyOTP(email: string, otp: string): Promise<{ message: string, accessToken: string, refreshToken: string }>;
    resendOTP(email: string): Promise<{ message: string }>
    forgetPassword(email: string, role: UserRole): Promise<{ message: string }>
    resetPassword(token: string, email: string, password: string): Promise<{ message: string }>
    refreshToken(token: string): Promise<{ accessToken: string, status?: boolean, blockReason?: string }>
    registerUser(email: string, password: string, firstName: string, lastName: string): Promise<{ message: string }>
}

export interface IAdminAuthService extends IAuthService {
    refreshToken(token: string): Promise<{ accessToken: string }>;
}