import { Request, Response } from "express";
import mongoose from "mongoose";
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { IUserController } from "../core/interfaces/controllers/user.controller.interface";
import { IUserService } from "../core/interfaces/services/user.service.interface";
import { mapUser } from "../dtos/implementations/user.dto";
import { SocketService } from "../services/socket.service";
import { HTTP_STATUS } from "../constants/http/status-codes";

@injectable()
export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private _userService: IUserService,
        @inject(TYPES.SocketService) private _socketService: SocketService
    ) { }

    getUserDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extract user ID from the authenticated token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "User ID is missing from the token" });
                return;
            }

            // Fetch user details from the database
            const user = await this._userService.getUserById(userId);
            if (!user) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
                return;
            }
            res.status(HTTP_STATUS.OK).json(mapUser(user));
        } catch (error) {
            console.error("Error occurred while updating user details:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return;
        }
    };

    updateUserDetails = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId; // Extract user ID from the token
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
                return
            }

            const user = await this._userService.updateUser(userId, data);
            if (!user) {
                console.error(`Error: User with ID ${userId} not found.`);
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "User not found."
                });
                return
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "User details updated successfully.",
                user: mapUser(user)
            });
        } catch (error) {
            console.error("Error occurred while updating user details:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return
        }
    };
    updateStatus = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid user ID format"
                });
                return;
            }
            const response = await this._userService.toggleStatus(userId)

            if (!response.status) {
                this._socketService.disconnectUser(userId);
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: `User successfully ${response.status ? 'unblocked' : 'blocked'}`,
                data: {
                    userId: response._id,
                    status: response.status
                }
            });
        } catch (error) {
            console.error("Error occurred while updating user details:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return
        }
    }
    changePassword = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                console.error("Error: User ID is missing from the token.");
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "User ID is missing from the token."
                });
                return
            }
            const { currentPassword, newPassword } = req.body
            if (!currentPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: "Request Body doesn't have enough data to complete"
                })
                return;
            }
            const response = await this._userService.changePassword(currentPassword, newPassword, userId)
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
            console.error("Error occurred while updating user details:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return
        }
    }
    getUserDashboard = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId; // Extract user ID from the token
            if (!userId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "User ID is missing from the token" });
                return;
            }

            // Fetch user dashboard stats from the database
            const stats = await this._userService.getUserDashboard(userId);
            if (!stats) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User dashboard stats not found" });
                return;
            }
            res.status(HTTP_STATUS.OK).json(stats);
        } catch (error) {
            console.error("Error occurred while fetching user dashboard stats:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return;
        }
    };
}
