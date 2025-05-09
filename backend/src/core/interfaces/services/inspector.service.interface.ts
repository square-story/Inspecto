import { IInspector } from "../../../models/inspector.model";
import { ChangePasswordResponse } from "../../../services/inspector.service";
import { IInspectorDashboardStats } from "../../types/inspector.dashboard.stats.type";
import { IBaseService } from "./base/base.service.interface";

export interface IInspectorService extends IBaseService<IInspector> {
    changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<{ status: boolean; message: string }>;
    completeInspectorProfile(userId: string, data: Partial<IInspector>): Promise<IInspector | null | undefined>;
    approveInspector(inspectorId: string): Promise<IInspector | null>;
    denyInspector(inspectorId: string, reason: string): Promise<IInspector | null>;
    BlockHandler(inspectorId: string): Promise<"UnBlocked" | "Blocked">;
    changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<ChangePasswordResponse>;
    getNearbyInspectors(latitude: string, longitude: string): Promise<IInspector[]>;
    bookingHandler(inspectorId: string, userId: string, date: Date): Promise<IInspector | null>;
    unBookingHandler(inspectorId: string, userId: string, date: Date): Promise<IInspector | null>;
    getInspectorDashboardStats(inspectorId: string): Promise<IInspectorDashboardStats>;
}
