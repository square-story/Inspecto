import { IAdmin } from "../../../models/admin.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IAdminRepository extends BaseRepository<IAdmin> {
    findByEmail(email: string): Promise<IAdmin | null>;
    findAllAdmins(): Promise<IAdmin[]>;
}