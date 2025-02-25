import { Response } from "express";
import { AdminRepository } from "../../repositories/admin.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.utils";
import { inject, injectable } from "inversify";
import { IAdminAuthService, IAuthService } from "../../core/interfaces/services/auth.service.interface";
import { TYPES } from "../../di/types";
import { BaseAuthService } from "../../core/abstracts/base.auth.service";
import { Types } from "mongoose";
import { IAdminRepository } from "../../core/interfaces/repositories/admin.repository.interface";

@injectable()
export class AdminAuthService extends BaseAuthService implements IAdminAuthService {

    constructor(
        @inject(TYPES.AdminRepository) private readonly adminRepository: IAdminRepository
    ) {
        super();
    }

    async login(email: string, password: string) {
        const admin = await this.adminRepository.findByEmail(email)
        if (!admin || admin.password !== password) {
            throw new Error('Invalid username or password')
        }
        const payload = {
            userId: new Types.ObjectId(admin._id.toString()),
            role: admin.role || 'admin'
        }
        const { accessToken, refreshToken } = this.generateTokens(payload)

        return { accessToken, refreshToken }
    }
}