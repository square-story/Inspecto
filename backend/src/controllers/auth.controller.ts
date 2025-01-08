import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import UserRepository from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth";

const REFRESH_TOKENS: string[] = [] // Temporary in-memory storage for refresh tokens.

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await UserRepository.findUserByEmail(email)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.Password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const payload = { userId: user.id.toString() };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload)

        REFRESH_TOKENS.push(refreshToken);

        res.status(200).json({ accessToken, refreshToken })
    } catch (error) {
        console.error('Error in login:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const refreshToken = (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token || !REFRESH_TOKENS.includes(token)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' })
    }
    const newAccessToken = generateAccessToken({ userId: payload.userId })
    res.status(200).json({ accessToken: newAccessToken })
}

