import { IInspector } from "../../models/inspector.model";

export interface IinspectorRepository {
    createInspector(userData: Partial<IInspector>): Promise<IInspector>;
    findInspectorByEmail(email: string): Promise<IInspector | null>;
    updateInspector(userId: string, updates: Partial<IInspector>): Promise<IInspector | null>;
    deleteInspector(userId: string): Promise<IInspector | null>;
    getAllInspector(): Promise<IInspector[]>;
    updateInspectorPassword(email: string, password: string): Promise<IInspector | null>;
}