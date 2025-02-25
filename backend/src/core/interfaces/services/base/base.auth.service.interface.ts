import { Types } from "mongoose";

export interface IBaseAuthService {
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>
}