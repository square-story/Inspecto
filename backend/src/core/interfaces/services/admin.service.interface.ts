import { IAdmin } from "../../../models/admin.model";
import { IInspector } from "../../../models/inspector.model";
import { IUsers } from "../../../models/user.model";
import { IBaseService } from "./base/base.service.interface";

export interface IAdminService extends IBaseService<IAdmin> {
    findByEmail(email: string): Promise<IAdmin | null>;
    getAllInspectors(): Promise<IInspector[]>;
    getAllUsers(): Promise<IUsers[]>
}