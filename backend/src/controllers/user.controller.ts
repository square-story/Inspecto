import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
    public static getUserDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Extract user ID from the authenticated token
            const userId = req.user?.userId;
            if (!userId) {
                res.status(400).json({ message: "User ID is missing from the token" });
                return;
            }

            // Fetch user details from the database
            const user = await userService.findUserByUserId(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error)
        }
    };
    public static updateUserDetails: RequestHandler = async (req: Request, res: Response) => {
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

            const user = await userService.updateUser(userId, data); // Call the service to update the user
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
}
