import { IInspectionDocument, IInspectionInput } from "../../../models/inspection.model";

export interface IInspectionService {
    createInspection(data: IInspectionInput): Promise<IInspectionDocument>;
    updateInspection(id: string, data: Partial<IInspectionInput>): Promise<IInspectionDocument | null>;
    getInspectionById(id: string): Promise<IInspectionDocument | null>;
    getUserInspections(userId: string): Promise<IInspectionDocument[]>;
    getInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]>;
    getAvailableSlots(inspectorId: string, date: Date): Promise<number[]>;
    findInspections(userId: string): Promise<IInspectionDocument[]>;
    findInspectionsByInspector(inspectorId: string): Promise<IInspectionDocument[]>;
}