import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.utils";
import { Types } from "mongoose";
import { IBaseAuthService } from "../interfaces/services/base/base.auth.service.interface";

export abstract class BaseAuthService implements IBaseAuthService {
    protected generateTokens(payload: { userId: Types.ObjectId; role: string }) {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    async refreshToken(token: string) {
        const payload = await verifyRefreshToken(token);
        if (!payload?.userId || !payload?.role) {
            throw new Error('Invalid token payload');
        }
        const newAccessToken = await generateAccessToken({
            userId: payload.userId,
            role: payload.role
        });
        return { accessToken: newAccessToken };
    }
}