import { IVehicleDocument } from "../models/vehicle.model";
import { IVehicleRepository } from "./interfaces/vehicle.repository.interface";
import Vehicle from '../models/vehicle.model';

class VehicleRepository implements IVehicleRepository {
    async createVehicle(vehicleData: IVehicleDocument): Promise<IVehicleDocument> {
        const vehicle = new Vehicle(vehicleData);
        return await vehicle.save();
    }

    async findVehicleById(vehicleId: string): Promise<IVehicleDocument | null> {
        return await Vehicle.findById(vehicleId);
    }

    async findVehiclesByUser(userId: string): Promise<IVehicleDocument[]> {
        return await Vehicle.find({ user: userId });
    }

    async deleteVehicle(vehicleId: string): Promise<boolean> {
        const result = await Vehicle.findByIdAndDelete(vehicleId);
        return result !== null;
    }

    async updateVehicle(vehicleId: string, updateData: Partial<IVehicleDocument>): Promise<IVehicleDocument | null> {
        return await Vehicle.findByIdAndUpdate(vehicleId, updateData, { new: true });
    }
}

export default VehicleRepository
