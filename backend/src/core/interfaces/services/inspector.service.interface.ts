import { IInspector } from "../../../models/inspector.model";

export interface IInspectorService {
    findInspectorById(id: string): Promise<IInspector | null>;
    updateInspector(id: string, updates: Partial<IInspector>): Promise<IInspector | null>;
    getAllInspectors(): Promise<IInspector[]>;
    changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<{ status: boolean; message: string }>;
}