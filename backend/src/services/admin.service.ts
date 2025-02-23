import { inject, injectable } from "inversify";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { InspectorRepository } from "../repositories/inspector.repository";
import { TYPES } from "../di/types";
import { UserRepository } from "../repositories/user.repository";
import { AdminRepository } from "../repositories/admin.repository";
import { IAdmin } from "../models/admin.model";
import { BaseService } from "../core/abstracts/base.service";

@injectable()
export class AdminService extends BaseService<IAdmin> implements IAdminService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.InspectorRepository) private inspectorRepository: InspectorRepository,
        @inject(TYPES.AdminRepository) private adminRepository: AdminRepository
    ) {
        super(adminRepository)
    }
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await this.repository.findOne({ email })
    }

    async getAllInspectors() {
        return await this.inspectorRepository.getAllInspector()
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers()
    }
}