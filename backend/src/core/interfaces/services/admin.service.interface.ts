import { IAdmin } from "../../../models/admin.model";

export interface IAdminService {
    findByEmail(email: string): Promise<IAdmin | null>;
}