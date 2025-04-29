import { IInspectionDocument, IInspectionInput } from "../../../models/inspection.model";
import { TimeSlot } from "../../../models/inspector.model";
import { IInspectionStats } from "../../types/inspection.stats.type";
import { IBaseService } from "./base/base.service.interface";

export interface IInspectionService extends IBaseService<IInspectionDocument> {
    createInspection(data: IInspectionInput): Promise<{
        booking: IInspectionDocument;
        amount: number;
        walletDeduction: number;
        remainingAmount: number;
    }>;
    updateInspection(id: string, data: Partial<IInspectionInput>): Promise<IInspectionDocument | null>;
    getInspectionById(id: string): Promise<IInspectionDocument | null>;
    getUserInspections(userId: string): Promise<IInspectionDocument[]>;
    getInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]>;
    getAvailableSlots(inspectorId: string, date: Date): Promise<TimeSlot[]>;
    findInspections(userId: string): Promise<IInspectionDocument[]>;
    findInspectionsByInspector(inspectorId: string): Promise<IInspectionDocument[]>;
    cancelInspection(inspectionId: string): Promise<void>;
    getStatsAboutInspector(inspectorId: string): Promise<IInspectionStats>
}