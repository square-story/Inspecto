import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import appConfig from '../config/app.config';
import redisClient from '../config/redis.config';
import { SetOptions } from 'redis';

const ACCESS_TOKEN_SECRET = appConfig.accessToken!;
const REFRESH_TOKEN_SECRET = appConfig.refreshToken!;
const ACCESS_TOKEN_EXPIRATION = appConfig.accessTime;
const REFRESH_TOKEN_EXPIRATION = appConfig.refreshTime;

interface TokenPayload {
    userId: Types.ObjectId,
    role: string
}

export const blacklistToken = async (token: string, expirationTime: number) => {
    const redisKey = `blacklist:${token}`;
    const options: SetOptions = {
        EX: expirationTime
    };
    await redisClient.set(redisKey, 'blacklisted', options);
};

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const verifyAccessToken = async (token: string): Promise<TokenPayload | null> => {
    try {
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            throw new Error('Token is blacklisted');
        }
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Invalid access token', error);
        return null;
    }
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload | null> => {
    try {
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            throw new Error('Token is blacklisted');
        }
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Invalid refresh token', error);
        return null;
    }
};