import { inject, injectable } from "inversify";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { TYPES } from "../di/types";
import { AdminRepository } from "../repositories/admin.repository";
import { IAdmin } from "../models/admin.model";
import { BaseService } from "../core/abstracts/base.service";
import { IUserRepository } from "../core/interfaces/repositories/user.repository.interface";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";

@injectable()
export class AdminService extends BaseService<IAdmin> implements IAdminService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.InspectorRepository) private inspectorRepository: IInspectorRepository,
        @inject(TYPES.AdminRepository) private adminRepository: AdminRepository
    ) {
        super(adminRepository)
    }
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await this.repository.findOne({ email })
    }

    async getAllInspectors() {
        return await this.inspectorRepository.findAll()
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers()
    }
}