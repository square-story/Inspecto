import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IInspectorController } from "../core/interfaces/controllers/inspector.controller.interface";
import { TYPES } from "../di/types";
import { ServiceError } from "../core/errors/service.error";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";
import { mapInspector } from "../dtos/implementations/inspector.dto";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";
import { SocketService } from "../services/socket.service";

@injectable()
export class InspectorController implements IInspectorController {
    constructor(
        @inject(TYPES.InspectorService) private _inspectorService: IInspectorService,
        @inject(TYPES.SocketService) private _socketService: SocketService
    ) { }

    getInspectorDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "User ID is missing from the token" });
                return;
            }
            const response = await this._inspectorService.getInspectorById(userId)
            if (!response) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_NOT_FOUND });
                return;
            }
            res.status(HTTP_STATUS.OK).json(mapInspector(response));
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }



    completeProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const { longitude, latitude, ...restData } = req.body; // Extract location data separately

            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'User ID is missing in the token' });
                return;
            }

            // Validate longitude and latitude
            if (!longitude || !latitude) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Longitude and Latitude are required' });
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
                res.status(HTTP_STATUS.OK).json({
                    message: RESPONSE_MESSAGES.SUCCESS.PROFILE_UPDATED,
                    data: response
                });
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.OPERATION_FAILED });
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }


    approvalProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.params.inspectorId
            if (!inspectorId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_ID_MISSING });
                return;
            }
            const isExist = await this._inspectorService.getInspectorById(inspectorId)
            if (!isExist) {
                res.status(HTTP_STATUS.NOT_FOUND).json(RESPONSE_MESSAGES.ERROR.INSPECTOR_NOT_FOUND)
                return
            }
            if (isExist.isListed) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_ALREADY_APPROVED });
                return;
            }
            const response = await this._inspectorService.approveInspector(inspectorId)
            if (response) {
                res.status(HTTP_STATUS.OK).json({
                    message: RESPONSE_MESSAGES.SUCCESS.PROFILE_UPDATED,
                });
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.OPERATION_FAILED });
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
    denyProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.params.inspectorId;
            const { reason } = req.body;

            if (!inspectorId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_ID_MISSING });
                return;
            }

            if (!reason || reason.trim().length === 0) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Denial reason is required' });
                return
            }

            const inspector = await this._inspectorService.getInspectorById(inspectorId)

            if (!inspector) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_NOT_FOUND });
                return
            }

            const updatedInspector = await this._inspectorService.denyInspector(inspectorId, reason);

            if (!updatedInspector) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.OPERATION_FAILED });
                return
            }

            res.status(HTTP_STATUS.OK).json({
                message: 'Profile denied successfully',
                inspector: mapInspector(updatedInspector)
            });
            return

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
    handleBlock = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.params.inspectorId
            if (!inspectorId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.INSPECTOR_ID_MISSING });
                return;
            }
            const response = await this._inspectorService.BlockHandler(inspectorId)
            if (response === 'Blocked') {
                this._socketService.disconnectUser(inspectorId);
            }
            if (response) {
                res.status(HTTP_STATUS.OK).json({
                    message: `Profile ${response} successfully`,
                });
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.OPERATION_FAILED });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
    updateInspector = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                console.error("Error: User ID is missing from the token.");
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "User ID is missing from the token."
                });
                return
            }
            const data = req.body; // Extract data from the request body
            if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
                console.error("Error: No valid data provided for update.");
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "No valid data provided for update."
                });
                return;
            }

            const inspector = await this._inspectorService.updateInspector(userId, data)
            if (!inspector) {
                console.error(`Error: User with ID ${userId} not found.`);
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INSPECTOR_NOT_FOUND
                });
                return
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.SUCCESS.PROFILE_UPDATED,
                inspector: mapInspector(inspector)
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId
            if (!inspectorId) {
                console.error("Error: User ID is missing from the token.");
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "User ID is missing from the token."
                });
                return
            }
            const { currentPassword, newPassword } = req.body
            if (!currentPassword || !newPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "Request Body doesn't have enough data to complete"
                })
                return;
            }
            const response = await this._inspectorService.changePassword(currentPassword, newPassword, inspectorId)
            if (response.status) {
                res.status(HTTP_STATUS.OK).json({
                    success: true,
                    message: response.message,
                });
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: response.message
                })
            }
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    getNearbyInspectors = async (req: Request, res: Response): Promise<void> => {
        try {
            const { latitude, longitude } = req.query;
            if (!latitude || !longitude) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Latitude and Longitude are required" });
                return
            }
            const inspectors = await this._inspectorService.getNearbyInspectors(latitude as string, longitude as string);
            res.status(HTTP_STATUS.OK).json(inspectors.map(inspector => mapInspector(inspector)));
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    getInspectorDashboardStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId
            if (!inspectorId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'User ID is missing in the token' });
                return;
            }
            const response = await this._inspectorService.getInspectorDashboardStats(inspectorId)
            if (response) {
                res.status(HTTP_STATUS.OK).json(response);
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.OPERATION_FAILED });
            return;
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
}