import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";
import { IVehicleDocument } from "../models/vehicle.model";
import { TYPES } from "../di/types";
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";

@injectable()
export class VehicleService extends BaseService<IVehicleDocument> implements IVehicleService {
    constructor(
        @inject(TYPES.VehicleRepository) private _vehicleRepository: IVehicleRepository
    ) {
        super(_vehicleRepository)
    }
}

