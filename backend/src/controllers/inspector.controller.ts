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
            const data = req.body
            if (!userId) {
                res.status(400).json('User Id is missing in the token')
                return;
            }
            const response = await inspectorService.completeInspectorProfile(userId, data)
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
}