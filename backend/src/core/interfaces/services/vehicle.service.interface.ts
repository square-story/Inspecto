import { IVehicleDocument } from "../../../models/vehicle.model";

export interface IVehicleService {
    getAllVehicles(): Promise<IVehicleDocument[]>;
    getVehicleById(id: string): Promise<IVehicleDocument | null>;
    createVehicle(data: Partial<IVehicleDocument>): Promise<IVehicleDocument>;
    updateVehicle(id: string, data: Partial<IVehicleDocument>): Promise<IVehicleDocument | null>;
    deleteVehicle(id: string): Promise<IVehicleDocument | null>;
    getVehiclesByUser(userId: string): Promise<IVehicleDocument[]>;
}