import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";
import { IVehicleDocument } from "../models/vehicle.model";
import { TYPES } from "../di/types";
import { VehicleRepository } from "../repositories/vehicle.repository";

@injectable()
export class VehicleService extends BaseService<IVehicleDocument> implements IVehicleService {
    constructor(
        @inject(TYPES.VehicleRepository) private vehicleRepository: VehicleRepository
    ) {
        super(vehicleRepository)
    }
    async getUserVehicles(userId: string): Promise<IVehicleDocument[]> {
        return await this.vehicleRepository.find({ user: userId })
    }

    async createVehicle(vehicleData: IVehicleDocument): Promise<IVehicleDocument> {
        return await this.vehicleRepository.createVehicle(vehicleData);
    }

    async getVehicleById(vehicleId: string): Promise<IVehicleDocument | null> {
        return await this.vehicleRepository.findVehicleById(vehicleId);
    }

    async getVehiclesByUser(userId: string): Promise<IVehicleDocument[]> {
        return await this.vehicleRepository.findVehiclesByUser(userId);
    }

    async updateVehicle(vehicleId: string, updateData: Partial<IVehicleDocument>): Promise<IVehicleDocument | null> {
        return await this.vehicleRepository.updateVehicle(vehicleId, updateData);
    }

    async deleteVehicle(vehicleId: string): Promise<boolean> {
        return await this.vehicleRepository.deleteVehicle(vehicleId);
    }
}

