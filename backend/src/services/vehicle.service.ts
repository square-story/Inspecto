import { IVehicleDocument } from "../models/vehicle.model";
import { IVehicleRepository } from "../repositories/interfaces/vehicle.repository.interface";

class VehicleService {
    private vehicleRepository: IVehicleRepository;

    constructor(vehicleRepository: IVehicleRepository) {
        this.vehicleRepository = vehicleRepository;
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

export default VehicleService;
