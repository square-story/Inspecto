import { Request, Response } from "express";
import { IVehicleDocument } from "../models/vehicle.model";
import { ObjectId, Types } from "mongoose";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IVehicleController } from "../core/interfaces/controllers/vehicle.controller.interface";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";

interface MongoErrorWithCode extends Error {
    code?: number;
    keyPattern?: Record<string, 1>;
    keyValue?: Record<string, string>;
}

@injectable()
export class VehicleController implements IVehicleController {
    constructor(
        @inject(TYPES.VehicleService) private _vehicleService: IVehicleService
    ) { }

    private handleError(res: Response, error: unknown): void {
        // Type guard to check if error is a MongoDB duplicate key error
        const isMongoError = (err: unknown): err is MongoErrorWithCode =>
            err instanceof Error && !!(err as MongoErrorWithCode).code;

        if (isMongoError(error)) {
            // Check for duplicate key error (Mongo error code 11000)
            if (error.code === 11000) {
                const duplicateKey = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'unknown';
                const duplicateValue = error.keyValue ? error.keyValue[duplicateKey] : 'value';

                res.status(409).json({
                    message: `Duplicate ${duplicateKey} Error`,
                    error: `A vehicle with this ${duplicateKey} (${duplicateValue}) already exists`,
                    duplicateField: duplicateKey,
                    duplicateValue: duplicateValue
                });
                return;
            }
        }

        // Handle other types of errors
        if (error instanceof Error) {
            switch (error.name) {
                case 'ValidationError':
                    res.status(400).json({
                        message: "Invalid vehicle data",
                        error: error.message
                    });
                    break;
                default:
                    res.status(500).json({
                        message: "Unexpected server error",
                        error: error.message
                    });
            }
        } else {
            res.status(500).json({
                message: "Unexpected server error",
                error: String(error)
            });
        }
    }

    createVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const vehicleData: IVehicleDocument = req.body;
            const userId = req.user?.userId;

            // Validate user authentication
            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required",
                    error: "No user ID found in request"
                });
                return;
            }

            // Attach user ID to vehicle data
            vehicleData.user = userId as unknown as ObjectId;

            const vehicle = await this._vehicleService.create(vehicleData);
            res.status(201).json(vehicle);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getVehicleById = async (req: Request, res: Response): Promise<void> => {
        try {
            const vehicleId = req.params.vehicleId;
            const userId = req.user?.userId;

            // Validate input
            if (!vehicleId) {
                res.status(400).json({
                    message: "Vehicle ID is required"
                });
                return;
            }

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                return;
            }

            const vehicle = await this._vehicleService.findById(new Types.ObjectId(vehicleId));
            if (!vehicle) {
                res.status(404).json({
                    message: "Vehicle not found"
                });
                return;
            }

            res.json(vehicle);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getVehiclesByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                return;
            }

            const vehicles = await this._vehicleService.find({ user: userId }, ["lastInspectionId", "lastInspectionId.inspectionTypeId"]);
            if (!vehicles || vehicles.length === 0) {
                res.status(404).json({
                    message: "No vehicles found for this user"
                });
                return;
            }

            res.json(vehicles);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    updateVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const vehicleId = req.params.vehicleId;
            const updateData = req.body;
            const userId = req.user?.userId;

            // Validate inputs
            if (!vehicleId) {
                res.status(400).json({
                    message: "Vehicle ID is required"
                });
                return;
            }

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                return;
            }

            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    message: "No update data provided"
                });
                return;
            }

            const updatedVehicle = await this._vehicleService.update(new Types.ObjectId(vehicleId), updateData);
            res.json(updatedVehicle);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    deleteVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const vehicleId = req.params.vehicleId;
            const userId = req.user?.userId;

            // Validate inputs
            if (!vehicleId) {
                res.status(400).json({
                    message: "Vehicle ID is required"
                });
                return;
            }

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                return;
            }

            await this._vehicleService.delete(new Types.ObjectId(vehicleId));
            res.status(204).send();
        } catch (error) {
            this.handleError(res, error);
        }
    }
}