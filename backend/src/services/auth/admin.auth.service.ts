import { Response } from "express";
import { AdminRepository } from "../../repositories/admin.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.utils";
import { inject, injectable } from "inversify";
import { IAuthService } from "../../core/interfaces/services/auth.service.interface";
import { TYPES } from "../../di/types";
import { BaseAuthService } from "../../core/abstracts/base.auth.service";
import { Types } from "mongoose";

@injectable()
export class AdminAuthService extends BaseAuthService implements IAuthService {

    constructor(
        @inject(TYPES.AdminRepository)
        private readonly adminRepository: AdminRepository
    ) {
        super();
    }
    loginUser(email: string, password: string, res: Response): Promise<{ accessToken: string; role: string; status: true; } | undefined> {
        throw new Error("Method not implemented.");
    }
    logout(token: string): Promise<void> {
        return Promise.resolve();
    }
    async login(email: string, password: string) {
        const admin = await this.adminRepository.findByEmail(email)
        if (!admin || admin.password !== password) {
            throw new Error('Invalid username or password')
        }
        const payload = {
            userId: new Types.ObjectId(admin._id.toString()),
            role: admin.role || 'admin' // Providing default role if undefined
        }
        const { accessToken, refreshToken } = this.generateTokens(payload)

        return { accessToken, refreshToken }
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