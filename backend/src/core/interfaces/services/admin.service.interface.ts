import { IAdmin } from "../../../models/admin.model";
import { IInspector } from "../../../models/inspector.model";
import { IUsers } from "../../../models/user.model";

export interface IAdminService {
    findByEmail(email: string): Promise<IAdmin | null>;
    getAllInspectors(): Promise<IInspector[]>;
    getAllUsers(): Promise<IUsers[]>
}