import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";
import { IVehicleDocument } from "../models/vehicle.model";
import { TYPES } from "../di/types";
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";
import { Types } from "mongoose";

@injectable()
export class VehicleService extends BaseService<IVehicleDocument> implements IVehicleService {
    constructor(
        @inject(TYPES.VehicleRepository) private vehicleRepository: IVehicleRepository
    ) {
        super(vehicleRepository)
    }
    async getUserVehicles(userId: string): Promise<IVehicleDocument[]> {
        return await this.vehicleRepository.find({ user: userId })
    }

    async createVehicle(vehicleData: IVehicleDocument): Promise<IVehicleDocument> {
        return await this.vehicleRepository.create(vehicleData);
    }

    async getVehicleById(vehicleId: string): Promise<IVehicleDocument | null> {
        return await this.vehicleRepository.findById(new Types.ObjectId(vehicleId));
    }

    async getVehiclesByUser(userId: string): Promise<IVehicleDocument[]> {
        return await this.vehicleRepository.findVehiclesByUser(userId);
    }

    async updateVehicle(vehicleId: string, updateData: Partial<IVehicleDocument>): Promise<IVehicleDocument | null> {
        return await this.vehicleRepository.update(new Types.ObjectId(vehicleId), updateData);
    }

    async deleteVehicle(vehicleId: string): Promise<boolean> {
        return await this.vehicleRepository.deleteVehicle(vehicleId);
    }
}

