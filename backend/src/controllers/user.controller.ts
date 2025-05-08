import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { IUserController } from "../core/interfaces/controllers/user.controller.interface";
import { IUserService } from "../core/interfaces/services/user.service.interface";

@injectable()
export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private _userService: IUserService
    ) { }

    getUserDetails = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extract user ID from the authenticated token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(400).json({ message: "User ID is missing from the token" });
                return;
            }

            // Fetch user details from the database
            const user = await this._userService.findById(new Types.ObjectId(userId));
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Error occurred while updating user details:", error);
            res.status(500).json({
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

            const user = await this._userService.update(new Types.ObjectId(userId), data);
            if (!user) {
                console.error(`Error: User with ID ${userId} not found.`);
                res.status(404).json({
                    success: false,
                    message: "User not found."
                });
                return
            }
            res.status(200).json({
                success: true,
                message: "User details updated successfully.",
                user
            });
        } catch (error) {
            console.error("Error occurred while updating user details:", error);
            res.status(500).json({
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
                res.status(400).json({
                    success: false,
                    message: "Invalid user ID format"
                });
                return;
            }
            const response = await this._userService.toggleStatus(userId)

            res.status(200).json({
                success: true,
                message: `User successfully ${response.status ? 'unblocked' : 'blocked'}`,
                data: {
                    userId: response._id,
                    status: response.status
                }
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
    changePassword = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId
            if (!userId) {
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
            const response = await this._userService.changePassword(currentPassword, newPassword, userId)
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
    getUserDashboard = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId; // Extract user ID from the token
            if (!userId) {
                res.status(400).json({ message: "User ID is missing from the token" });
                return;
            }

            // Fetch user dashboard stats from the database
            const stats = await this._userService.getUserDashboard(userId);
            if (!stats) {
                res.status(404).json({ message: "User dashboard stats not found" });
                return;
            }
            res.status(200).json(stats);
        } catch (error) {
            console.error("Error occurred while fetching user dashboard stats:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error. Please try again later."
            });
            return;
        }
    };
}
