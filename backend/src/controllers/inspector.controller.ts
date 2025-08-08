import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IInspectorController } from "../core/interfaces/controllers/inspector.controller.interface";
import { TYPES } from "../di/types";
import { ServiceError } from "../core/errors/service.error";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";
import { mapInspector } from "../dtos/implementations/inspector.dto";

@injectable()
export class InspectorController implements IInspectorController {
    constructor(
        @inject(TYPES.InspectorService) private _inspectorService: IInspectorService
    ) { }

    getInspectorDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(400).json({ message: "User ID is missing from the token" });
                return;
            }
            const response = await this._inspectorService.getInspectorById(userId)
            if (!response) {
                res.status(404).json({ message: "Inspector not found" });
                return;
            }
            res.status(200).json(mapInspector(response));
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }



    completeProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const { longitude, latitude, ...restData } = req.body; // Extract location data separately

            if (!userId) {
                res.status(400).json({ message: 'User ID is missing in the token' });
                return;
            }

            // Validate longitude and latitude
            if (!longitude || !latitude) {
                res.status(400).json({ message: 'Longitude and Latitude are required' });
                return
            }

            // Ensure location follows MongoDB's GeoJSON format
            const location = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)] // Convert to numbers
            };

            const updatedData = { ...restData, location }; // Merge with other form data
            const response = await this._inspectorService.completeInspectorProfile(userId, updatedData)
            if (response) {
                res.status(200).json({
                    message: 'Profile updated successfully',
                    data: response
                });
                return;
            }
            res.status(400).json({ message: 'Failed to update profile' });
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }


    approvalProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.params.inspectorId
            if (!inspectorId) {
                res.status(400).json({ message: 'Inspector ID is missing in the params' });
                return;
            }
            const isExist = await this._inspectorService.getInspectorById(inspectorId)
            if (!isExist) {
                res.status(404).json("Inspector not found in the database")
                return
            }
            if (isExist.isListed) {
                res.status(400).json({ message: "Inspector is already approved" });
                return;
            }
            const response = await this._inspectorService.approveInspector(inspectorId)
            if (response) {
                res.status(200).json({
                    message: 'Profile updated successfully',
                });
                return;
            }
            res.status(400).json({ message: 'Failed to update profile' });
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    denyProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.params.inspectorId;
            const { reason } = req.body;

            if (!inspectorId) {
                res.status(400).json({ message: 'Inspector ID is missing in the params' });
                return;
            }

            if (!reason || reason.trim().length === 0) {
                res.status(400).json({ message: 'Denial reason is required' });
                return
            }

            const inspector = await this._inspectorService.getInspectorById(inspectorId)

            if (!inspector) {
                res.status(404).json({ message: "Inspector not found in the database" });
                return
            }

            const updatedInspector = await this._inspectorService.denyInspector(inspectorId, reason);

            if (!updatedInspector) {
                res.status(400).json({ message: 'Failed to deny profile' });
                return
            }

            res.status(200).json({
                message: 'Profile denied successfully',
                inspector: mapInspector(updatedInspector)
            });
            return

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    handleBlock = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.params.inspectorId
            if (!inspectorId) {
                res.status(400).json({ message: 'Inspector ID is missing in the params' });
                return;
            }
            const response = await this._inspectorService.BlockHandler(inspectorId)
            if (response) {
                res.status(200).json({
                    message: `Profile ${response} successfully`,
                });
                return;
            }
            res.status(400).json({ message: 'Failed to update profile' });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    updateInspector = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                console.error("Error: User ID is missing from the token.");
                res.status(400).json({
                    success: false,
                    message: "User ID is missing from the token."
                });
                return
            }
            const data = req.body; // Extract data from the request body
            if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
                console.error("Error: No valid data provided for update.");
                res.status(400).json({
                    success: false,
                    message: "No valid data provided for update."
                });
                return;
            }

            const inspector = await this._inspectorService.updateInspector(userId, data)
            if (!inspector) {
                console.error(`Error: User with ID ${userId} not found.`);
                res.status(404).json({
                    success: false,
                    message: "inspector not found."
                });
                return
            }
            res.status(200).json({
                success: true,
                message: "User details updated successfully.",
                inspector: mapInspector(inspector)
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId
            if (!inspectorId) {
                console.error("Error: User ID is missing from the token.");
                res.status(400).json({
                    success: false,
                    message: "User ID is missing from the token."
                });
                return
            }
            const { currentPassword, newPassword } = req.body
            if (!currentPassword) {
                res.status(400).json({
                    success: false,
                    message: "Request Body doesn't have enough data to complete"
                })
                return;
            }
            const response = await this._inspectorService.changePassword(currentPassword, newPassword, inspectorId)
            if (response.status) {
                res.status(200).json({
                    success: true,
                    message: response.message,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: response.message
                })
            }
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    getNearbyInspectors = async (req: Request, res: Response): Promise<void> => {
        try {
            const { latitude, longitude } = req.query;
            if (!latitude || !longitude) {
                res.status(400).json({ message: "Latitude and Longitude are required" });
                return
            }
            const inspectors = await this._inspectorService.getNearbyInspectors(latitude as string, longitude as string);
            res.status(200).json(inspectors.map(inspector => mapInspector(inspector)));
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    getInspectorDashboardStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId
            if (!inspectorId) {
                res.status(400).json({ message: 'User ID is missing in the token' });
                return;
            }
            const response = await this._inspectorService.getInspectorDashboardStats(inspectorId)
            if (response) {
                res.status(200).json(response);
                return;
            }
            res.status(400).json({ message: 'Failed to fetch inspector dashboard stats' });
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
}