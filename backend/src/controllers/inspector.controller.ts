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
}