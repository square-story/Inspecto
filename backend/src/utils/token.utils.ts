import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import appConfig from '../config/app.config';

const ACCESS_TOKEN_SECRET = appConfig.accessToken!;
const REFRESH_TOKEN_SECRET = appConfig.refreshToken!;
const ACCESS_TOKEN_EXPIRATION = appConfig.accessTime;
const REFRESH_TOKEN_EXPIRATION = appConfig.refreshTime;

interface TokenPayload {
    userId: Types.ObjectId,
    role: string
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Invalid access token', error);
        return null;
    }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Invalid refresh token', error);
        return null;
    }
};