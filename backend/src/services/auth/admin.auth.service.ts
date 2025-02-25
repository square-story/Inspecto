import { inject, injectable } from "inversify";
import { IAdminAuthService } from "../../core/interfaces/services/auth.service.interface";
import { TYPES } from "../../di/types";
import { BaseAuthService } from "../../core/abstracts/base.auth.service";
import { Types } from "mongoose";
import { IAdminRepository } from "../../core/interfaces/repositories/admin.repository.interface";
import { ServiceError } from "../../core/errors/service.error";

@injectable()
export class AdminAuthService extends BaseAuthService implements IAdminAuthService {

    constructor(
        @inject(TYPES.AdminRepository) private readonly adminRepository: IAdminRepository
    ) {
        super();
    }

    async login(email: string, password: string) {
        try {
            const admin = await this.adminRepository.findByEmail(email)
            if (!admin) throw new ServiceError('Admin Not Found', 'email')
            if (admin.password !== password) throw new ServiceError('Invalid Password', 'password')
            const payload = {
                userId: new Types.ObjectId(admin._id.toString()),
                role: admin.role || 'admin'
            }
            return this.generateTokens(payload)
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Login Failed', 'email')
        }
    }
    async refreshToken(token: string) {
        try {
            return await super.refreshToken(token);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Token refresh failed', 'token');
        }
    }
}