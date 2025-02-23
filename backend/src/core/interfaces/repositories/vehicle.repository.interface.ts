import { IVehicleDocument, IVehicleInput } from "../../../models/vehicle.model";

export interface IVehicleRepository {
    /**
     * Create a new vehicle
     * @param vehicleData - Vehicle details to be added
     * @returns The created vehicle document
     */
    createVehicle(vehicleData: IVehicleInput): Promise<IVehicleDocument>;

    /**
     * Find a vehicle by its ID
     * @param vehicleId - The ID of the vehicle
     * @returns The vehicle document if found
     */
    findVehicleById(vehicleId: string): Promise<IVehicleDocument | null>;

    /**
     * Find all vehicles owned by a user
     * @param userId - The ID of the user
     * @returns An array of vehicle documents
     */
    findVehiclesByUser(userId: string): Promise<IVehicleDocument[]>;

    /**
     * Update a vehicle by its ID
     * @param vehicleId - The ID of the vehicle to update
     * @param updateData - The fields to update
     * @returns The updated vehicle document
     */
    updateVehicle(vehicleId: string, updateData: Partial<IVehicleInput>): Promise<IVehicleDocument | null>;

    /**
     * Delete a vehicle by its ID
     * @param vehicleId - The ID of the vehicle to delete
     * @returns A boolean indicating whether the deletion was successful
     */
    deleteVehicle(vehicleId: string): Promise<boolean>;
}
