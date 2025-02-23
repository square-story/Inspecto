import { injectable } from "inversify";
import { IAdmin } from "../models/admin.model";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IAdminRepository } from "../core/interfaces/repositories/admin.repository.interface";

@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    async findByEmail(email: string) {
        return this.model.findOne({ email: email })
    }
}
