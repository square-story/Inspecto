import { Request, Response } from "express";
import VehicleService from "../services/vehicle.service";
import { IVehicleDocument } from "../models/vehicle.model";
import { ObjectId } from "mongoose";


interface MongoErrorWithCode extends Error {
    code?: number;
    keyPattern?: Record<string, 1>;
    keyValue?: Record<string, string>;
}

export default class VehicleController {
    private vehicleService: VehicleService;

    constructor(vehicleService: VehicleService) {
        this.vehicleService = vehicleService;
    }

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

    async createVehicle(req: Request, res: Response): Promise<void> {
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

            try {
                const vehicle = await this.vehicleService.createVehicle(vehicleData);
                res.status(201).json(vehicle);
            } catch (error) {
                this.handleError(res, error);
            }
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async getVehicleById(req: Request, res: Response): Promise<void> {
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

            try {
                const vehicle = await this.vehicleService.getVehicleById(vehicleId);

                // Additional authorization check
                if (vehicle && vehicle.user.toString() !== userId) {
                    res.status(403).json({
                        message: "Forbidden: You do not have access to this vehicle"
                    });
                    return;
                }

                if (!vehicle) {
                    res.status(404).json({
                        message: "Vehicle not found"
                    });
                    return;
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

    async getVehiclesByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    message: "Unauthorized: User authentication required"
                });
                return;
            }

            try {
                const vehicles = await this.vehicleService.getVehiclesByUser(userId);

                if (vehicles.length === 0) {
                    res.status(404).json({
                        message: "No vehicles found for this user"
                    });
                    return;
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

    async updateVehicle(req: Request, res: Response): Promise<void> {
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

            try {
                // First, verify vehicle ownership
                const existingVehicle = await this.vehicleService.getVehicleById(vehicleId);

                if (!existingVehicle) {
                    res.status(404).json({
                        message: "Vehicle not found"
                    });
                    return;
                }

                if (existingVehicle.user.toString() !== userId) {
                    res.status(403).json({
                        message: "Forbidden: You do not have permission to update this vehicle"
                    });
                    return;
                }

                // Proceed with update
                const updatedVehicle = await this.vehicleService.updateVehicle(vehicleId, updateData);

                res.json(updatedVehicle);
            } catch (error) {
                this.handleError(res, error);
            }
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async deleteVehicle(req: Request, res: Response): Promise<void> {
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

            try {
                // First, verify vehicle ownership
                const existingVehicle = await this.vehicleService.getVehicleById(vehicleId);

                if (!existingVehicle) {
                    res.status(404).json({
                        message: "Vehicle not found"
                    });
                    return;
                }

                if (existingVehicle.user.toString() !== userId) {
                    res.status(403).json({
                        message: "Forbidden: You do not have permission to delete this vehicle"
                    });
                    return;
                }

                // Proceed with deletion
                const deleted = await this.vehicleService.deleteVehicle(vehicleId);

                if (!deleted) {
                    res.status(500).json({
                        message: "Failed to delete vehicle"
                    });
                    return;
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