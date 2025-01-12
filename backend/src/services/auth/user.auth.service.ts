import { Response } from "express";
import UserRepository from "../../repositories/user.repository";
import { generateAccessToken, verifyAccessToken, generateRefreshToken } from "../../utils/token.utils";

export class UserAuthService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepository()
    }
    async login(email: string, password: string, res: Response) {
        const user = await this.userRepository.findUserByEmail(email)
        if (!user || user.password !== password) {
            throw new Error('Invalid password or Email')
        }
        const payload = { userId: user.id, role: user.role }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return ({ accessToken })
    }
    async refreshToken(token: string) {
        const payload = await verifyAccessToken(token)
        if (!payload?.userId || !payload?.role) {
            throw new Error('Invalid token payload')
        }
        const newAccessToken = generateAccessToken({ userId: payload.userId, role: payload.role })
        return { accessToken: newAccessToken }
    }

}


