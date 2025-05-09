import { Inspection } from "@/features/inspection/types";

export interface IInspectorDashboardStats {
    totalInspections: number;
    pendingInspections: number;
    totalEarnings: number;
    completionRate: number;
    completedInspections: number;
    recentInspections: Inspection[];
}