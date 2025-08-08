import { inject, injectable } from "inversify";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";
import { IVehicleDocument } from "../models/vehicle.model";
import { TYPES } from "../di/types";
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";
import { toObjectId } from "../utils/toObjectId.utils";

@injectable()
export class VehicleService implements IVehicleService {
    constructor(
        @inject(TYPES.VehicleRepository) private _vehicleRepository: IVehicleRepository
    ) {
    }

    async getAllVehicles(): Promise<IVehicleDocument[]> {
        return this._vehicleRepository.findAll();
    }

    async getVehicleById(id: string): Promise<IVehicleDocument | null> {
        return this._vehicleRepository.findById(toObjectId(id));
    }

    async createVehicle(data: Partial<IVehicleDocument>): Promise<IVehicleDocument> {
        return this._vehicleRepository.create(data);
    }

    async updateVehicle(id: string, data: Partial<IVehicleDocument>): Promise<IVehicleDocument | null> {
        return this._vehicleRepository.update(toObjectId(id), data);
    }

    async deleteVehicle(id: string): Promise<IVehicleDocument | null> {
        return await this._vehicleRepository.delete(toObjectId(id));
    }

    async getVehiclesByUser(userId: string): Promise<IVehicleDocument[]> {
        return await this._vehicleRepository.findVehiclesByUser(userId);
    }
}

