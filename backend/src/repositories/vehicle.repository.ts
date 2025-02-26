import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";
import { IVehicleDocument } from "../models/vehicle.model";
import Vehicle from '../models/vehicle.model';
import { Types } from "mongoose";

@injectable()
export class VehicleRepository extends BaseRepository<IVehicleDocument> implements IVehicleRepository {
    constructor() {
        super(Vehicle);
    }

    async findVehiclesByUser(userId: string): Promise<IVehicleDocument[]> {
        return await this.find({ user: userId })
    }

    async deleteVehicle(vehicleId: string): Promise<boolean> {
        const result = await this.delete(new Types.ObjectId(vehicleId))
        return result !== null;
    }
}


