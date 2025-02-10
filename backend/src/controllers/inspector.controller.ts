import { Request, RequestHandler, Response } from "express";
import { InspectorService } from "../services/inspector.service";

const inspectorService = new InspectorService()

export class InspectorController {
    static getInspectorDetails: RequestHandler = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(400).json({ message: "User ID is missing from the token" });
                return;
            }
            const response = await inspectorService.getInspectorDetails(userId)
            if (!response) {
                res.status(404).json({ message: "Inspector not found" });
                return;
            }
            res.status(200).json(response);
        } catch (error) {
            console.error(error)
        }
    }
    static completeProfile: RequestHandler = async (req: Request, res: Response) => {
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
            const response = await inspectorService.completeInspectorProfile(userId, updatedData)
            if (response) {
                res.status(200).json({
                    message: 'Profile updated successfully',
                    data: response
                });
                return;
            }
            res.status(400).json({ message: 'Failed to update profile' });
            return;
        } catch (error: any) {
            console.error('Profile completion error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
            return;
        }
    }
    static approvalProfile: RequestHandler = async (req: Request, res: Response) => {
        try {
            const inspectorId = req.params.inspectorId
            if (!inspectorId) {
                res.status(400).json({ message: 'Inspector ID is missing in the params' });
                return;
            }
            const isExist = await inspectorService.getInspectorDetails(inspectorId)
            if (!isExist) {
                res.status(404).json("Inspector not found in the database")
                return
            }
            if (isExist.isListed) {
                res.status(400).json({ message: "Inspector is already approved" });
                return;
            }
            const response = await inspectorService.approveInspector(inspectorId)
            if (response) {
                res.status(200).json({
                    message: 'Profile updated successfully',
                });
                return;
            }
            res.status(400).json({ message: 'Failed to update profile' });
            return;
        } catch (error: any) {
            console.error('Profile completion error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
            return;
        }
    }
    static denyProfile: RequestHandler = async (req: Request, res: Response) => {
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

            const inspector = await inspectorService.getInspectorDetails(inspectorId);

            if (!inspector) {
                res.status(404).json({ message: "Inspector not found in the database" });
                return
            }

            const updatedInspector = await inspectorService.denyInspector(inspectorId, reason);

            if (!updatedInspector) {
                res.status(400).json({ message: 'Failed to deny profile' });
                return
            }

            res.status(200).json({
                message: 'Profile denied successfully',
                inspector: updatedInspector
            });
            return

        } catch (error: any) {
            console.error('Profile denial error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
            return;
        }
    }
    static handleBlock: RequestHandler = async (req: Request, res: Response) => {
        try {
            const inspectorId = req.params.inspectorId
            if (!inspectorId) {
                res.status(400).json({ message: 'Inspector ID is missing in the params' });
                return;
            }
            const response = await inspectorService.BlockHandler(inspectorId)
            if (response) {
                res.status(200).json({
                    message: `Profile ${response} successfully`,
                });
                return;
            }
            res.status(400).json({ message: 'Failed to update profile' });
        } catch (error: any) {
            console.error('Profile denial error:', error);
            res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
            return;
        }
    }
    static updateInspector: RequestHandler = async (req: Request, res: Response) => {
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
                return
            }

            const inspector = inspectorService.completeInspectorProfile(userId, data)
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
                inspector
            });
        } catch (error) {
            console.error("Error occurred while updating user details:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return
        }
    }
    static changePassword: RequestHandler = async (req: Request, res: Response) => {
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
                console.log("Error: Request Body doesn't have enough data to complete")
                res.status(400).json({
                    success: false,
                    message: "Request Body doesn't have enough data to complete"
                })
                return;
            }
            const response = await inspectorService.changePassword(currentPassword, newPassword, inspectorId)
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
            console.error("Error occurred while updating user details:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return
        }
    }

    static getNearbyInspectors: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { latitude, longitude } = req.query;
            if (!latitude || !longitude) {
                res.status(400).json({ message: "Latitude and Longitude are required" });
                return
            }
            const inspectors = await inspectorService.getNearbyInspectors(latitude as string, longitude as string);
            res.status(200).json(inspectors);
            return;
        } catch (error: any) {
            console.error("Error in getNearbyInspectors:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error. Please try again later."
            });
            return
        }
    }

}