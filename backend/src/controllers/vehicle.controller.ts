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
        @inject(TYPES.VehicleService) private vehicleService: IVehicleService
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
                ;
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
                ;
            }

            // Attach user ID to vehicle data
            vehicleData.user = userId as unknown as ObjectId;

            try {
                const vehicle = await this.vehicleService.create(vehicleData);
                res.status(201).json(vehicle);
            } catch (error) {
                this.handleError(res, error);
            }
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
                ;
            }

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                ;
            }

            try {
                const vehicle = await this.vehicleService.findById(new Types.ObjectId(vehicleId));

                // Additional authorization check
                if (vehicle && vehicle.user.toString() !== userId) {
                    res.status(403).json({
                        message: "Forbidden: You do not have access to this vehicle"
                    });
                }

                if (!vehicle) {
                    res.status(404).json({
                        message: "Vehicle not found"
                    });
                }

                res.json(vehicle);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({
                        message: "Error retrieving vehicle",
                        error: error.message
                    });
                } else {
                    res.status(500).json({
                        message: "Unexpected error retrieving vehicle",
                        error: String(error)
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "Unexpected server error",
                error: String(error)
            });
        }
    }
    getVehiclesByUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
            }

            try {
                const vehicles = await this.vehicleService.find({ user: userId });

                if (!vehicles || vehicles.length === 0) {
                    res.status(404).json({
                        message: "No vehicles found for this user"
                    });
                }

                res.json(vehicles);
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({
                        message: "Error retrieving user's vehicles",
                        error: error.message
                    });
                } else {
                    res.status(500).json({
                        message: "Unexpected error retrieving vehicles",
                        error: String(error)
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "Unexpected server error",
                error: String(error)
            });
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
                ;
            }

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                ;
            }

            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    message: "No update data provided"
                });
                ;
            }

            try {
                // First, verify vehicle ownership
                const existingVehicle = await this.vehicleService.findById(new Types.ObjectId(vehicleId));

                if (!existingVehicle) {
                    res.status(404).json({
                        message: "Vehicle not found"
                    });
                }

                if (existingVehicle && existingVehicle.user.toString() !== userId) {
                    res.status(403).json({
                        message: "Forbidden: You do not have permission to update this vehicle"
                    });
                    ;
                }

                // Proceed with update
                const updatedVehicle = await this.vehicleService.update(new Types.ObjectId(vehicleId), updateData);

                res.json(updatedVehicle);
            } catch (error) {
                this.handleError(res, error);
            }
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
                ;
            }

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                ;
            }

            try {
                // First, verify vehicle ownership
                const existingVehicle = await this.vehicleService.findById(new Types.ObjectId(vehicleId));

                if (!existingVehicle) {
                    res.status(404).json({
                        message: "Vehicle not found"
                    });
                    ;
                }

                if (existingVehicle && existingVehicle.user.toString() !== userId) {
                    res.status(403).json({
                        message: "Forbidden: You do not have permission to delete this vehicle"
                    });
                }

                // Proceed with deletion
                const deleted = await this.vehicleService.delete(new Types.ObjectId(vehicleId));

                if (!deleted) {
                    res.status(500).json({
                        message: "Failed to delete vehicle"
                    });
                    ;
                }

                res.status(204).send();
            } catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({
                        message: "Error deleting vehicle",
                        error: error.message
                    });
                } else {
                    res.status(500).json({
                        message: "Unexpected error deleting vehicle",
                        error: String(error)
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                message: "Unexpected server error",
                error: String(error)
            });
        }
    }
}