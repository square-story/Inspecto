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
            // Send user details (exclude sensitive data like password)
            res.status(200).json({
                id: user.id,
                firstName: user.firstName,
                email: user.email,
                role: user.role,
            });
        } catch (error) {
            next(error); // Pass the error to the error-handling middleware
        }
    };
}
