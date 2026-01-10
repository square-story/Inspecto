import bcrypt from 'bcrypt';
import { inject, injectable } from "inversify";
import { IAdminAuthService } from "../../core/interfaces/services/auth.service.interface";
import { TYPES } from "../../di/types";
import { Types } from "mongoose";
import { IAdminRepository } from "../../core/interfaces/repositories/admin.repository.interface";
import { ServiceError } from "../../core/errors/service.error";
import { generateTokens, refreshTokens } from "../../utils/token.utils";

@injectable()
export class AdminAuthService implements IAdminAuthService {

    constructor(
        @inject(TYPES.AdminRepository) private readonly _adminRepository: IAdminRepository
    ) {
    }

    async login(email: string, password: string) {
        try {
            const admin = await this._adminRepository.findByEmail(email)
            if (!admin) throw new ServiceError('Admin Not Found', 'email')

            const isPasswordMatch = await bcrypt.compare(password, admin.password);
            if (!isPasswordMatch) throw new ServiceError('Invalid Password', 'password')

            const payload = {
                userId: new Types.ObjectId(admin._id.toString()),
                role: admin.role || 'admin'
            }
            return generateTokens(payload)
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Login Failed', 'email')
        }
    }
    async refreshToken(token: string) {
        try {
            return await refreshTokens(token);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Token refresh failed', 'token');
        }
    }
}