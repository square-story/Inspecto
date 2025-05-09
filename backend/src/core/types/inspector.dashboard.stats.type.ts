import { IInspectionDocument } from "../../models/inspection.model";

export interface IInspectorDashboardStats {
    totalInspections: number;
    pendingInspections: number;
    totalEarnings: number;
    completionRate: number;
    completedInspections: number;
    recentInspections: IInspectionDocument[];
}
