import { IVehicleDocument, IVehicleInput } from "../../../models/vehicle.model";

export interface IVehicleService {
    createVehicle(data: IVehicleInput): Promise<IVehicleDocument>;
    updateVehicle(id: string, data: Partial<IVehicleDocument>): Promise<IVehicleDocument | null>;
    getVehicleById(id: string): Promise<IVehicleDocument | null>;
    getUserVehicles(userId: string): Promise<IVehicleDocument[]>;
    deleteVehicle(id: string): Promise<boolean>;
}