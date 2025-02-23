import { Response } from "express";

export interface IAuthService {
    login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
    refreshToken(token: string): Promise<{ accessToken: string }>;
}