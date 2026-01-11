import { injectable } from "inversify";
import { Admin, IAdmin } from "../models/admin.model";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IAdminRepository } from "../core/interfaces/repositories/admin.repository.interface";

@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor() {
        super(Admin);
    }
    async findByEmail(email: string) {
        return this.model.findOne({ email: email })
    }
    async findAllAdmins(): Promise<IAdmin[]> {
        return this.model.find({ role: 'admin' });
    }
}
