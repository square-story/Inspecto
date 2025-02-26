import { IVehicleDocument, IVehicleInput } from "../../../models/vehicle.model";
import { IBaseService } from "./base/base.service.interface";

export interface IVehicleService extends IBaseService<IVehicleDocument> {
    createVehicle(data: IVehicleInput): Promise<IVehicleDocument>;
    updateVehicle(id: string, data: Partial<IVehicleDocument>): Promise<IVehicleDocument | null>;
    getVehicleById(id: string): Promise<IVehicleDocument | null>;
    getUserVehicles(userId: string): Promise<IVehicleDocument[]>;
    deleteVehicle(id: string): Promise<boolean>;
}