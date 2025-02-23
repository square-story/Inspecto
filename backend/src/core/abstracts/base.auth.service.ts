import { Response } from "express";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.utils";
import { Types } from "mongoose";

export abstract class BaseAuthService {
    protected generateTokens(payload: { userId: Types.ObjectId; role: string }) {
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    protected setRefreshTokenCookie(res: Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
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