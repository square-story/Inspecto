import { inject, injectable } from "inversify";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { TYPES } from "../di/types";
import { IAdmin } from "../models/admin.model";
import { BaseService } from "../core/abstracts/base.service";
import { IUserRepository } from "../core/interfaces/repositories/user.repository.interface";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";
import { ServiceError } from "../core/errors/service.error";
import { IUsers } from "../models/user.model";
import { IInspector } from "../models/inspector.model";
import { IAdminRepository } from "../core/interfaces/repositories/admin.repository.interface";

@injectable()
export class AdminService extends BaseService<IAdmin> implements IAdminService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.InspectorRepository) private inspectorRepository: IInspectorRepository,
        @inject(TYPES.AdminRepository) private adminRepository: IAdminRepository
    ) {
        super(adminRepository);
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        try {
            return await this.repository.findOne({ email });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding admin by email: ${error.message}`);
            }
            throw error;
        }
    }

    async getAllInspectors(): Promise<IInspector[]> {
        try {
            return await this.inspectorRepository.findAll();
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting all inspectors: ${error.message}`);
            }
            throw error;
        }
    }

    async getAllUsers(): Promise<IUsers[]> {
        try {
            return await this.userRepository.getAllUsers();
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting all users: ${error.message}`);
            }
            throw error;
        }
    }
}