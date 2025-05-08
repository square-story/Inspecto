import { IInspectionDocument } from "../../models/inspection.model";
import { IVehicleDocument } from "../../models/vehicle.model";

export interface IUserDashboardStats {
    upcomingInspections: number;
    myVehicles: number;
    completedInspections: number;
    upcomingInspectionsList?: IInspectionDocument[];
    myVehiclesList?: IVehicleDocument[];
    completedInspectionsList?: IInspectionDocument[];
}