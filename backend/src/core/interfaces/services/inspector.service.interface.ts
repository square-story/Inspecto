import { IInspector } from "../../../models/inspector.model";
import { IBaseService } from "./base/base.service.interface";

export interface IInspectorService extends IBaseService<IInspector> {
    findInspectorById(id: string): Promise<IInspector | null>;
    updateInspector(id: string, updates: Partial<IInspector>): Promise<IInspector | null>;
    getAllInspectors(): Promise<IInspector[]>;
    changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<{ status: boolean; message: string }>;
}