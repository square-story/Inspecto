import { Response } from "express";
import { AdminRepository } from "../../repositories/admin.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.utils";

export class AdminAuthService {
    private adminRepository: AdminRepository;

    constructor() {
        this.adminRepository = new AdminRepository()
    }
    async login(email: string, password: string, res: Response) {
        const admin = await this.adminRepository.findByEmail(email)
        if (!admin || admin.password !== password) {
            throw new Error('Invalid username or password')
        }
        const payload = { userId: admin._id, role: admin.role }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return { accessToken }
    }

    async refreshToken(token: string) {
        const payload = await verifyRefreshToken(token)
        if (!payload?.userId || !payload?.role) {
            throw new Error('Invalid token payload')
        }
        const newAccessToken = await generateAccessToken({ userId: payload.userId, role: payload.role })
        return { accessToken: newAccessToken }
    }

}