import { IVehicleDocument } from "../../../models/vehicle.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IVehicleRepository extends BaseRepository<IVehicleDocument> {

    /**
     * Find all vehicles owned by a user
     * @param userId - The ID of the user
     * @returns An array of vehicle documents
     */
    findVehiclesByUser(userId: string): Promise<IVehicleDocument[]>;


    /**
     * Delete a vehicle by its ID
     * @param vehicleId - The ID of the vehicle to delete
     * @returns A boolean indicating whether the deletion was successful
     */
    deleteVehicle(vehicleId: string): Promise<boolean>;
}
