import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import appConfig from "../config/app.config";
import { verifyAccessToken } from "../utils/token.utils";
import { InspectorService } from "../services/inspector.service";
import { UserService } from "../services/user.service";
import { InspectorStatus } from "../models/inspector.model";

declare module "express-serve-static-core" {
    interface Request {
        user?: { userId: string; role: string };
    }
}

const inspectorService = new InspectorService()
const userService = new UserService()

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token missing" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyAccessToken(token) as unknown as { userId: string; role: string; }
        if (payload.role === 'inspector') {
            const inspector = await inspectorService.getInspectorDetails(payload.userId)

            if (!inspector) {
                res.status(404).json({
                    success: false,
                    message: 'Inspector not found'
                });
                return;
            }
            if (inspector.status === InspectorStatus.BLOCKED) {
                res.status(403).json({
                    success: false,
                    message: 'Inspector Account is blocked',
                    code: 'ACCOUNT_BLOCKED'
                });
                return;
            }
        } else if (payload.role === 'user') {
            const user = await userService.findUserByUserId(payload.userId)
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            if (!user?.status) {
                res.status(403).json({
                    success: false,
                    message: "user account is blocked",
                    code: "ACCOUNT_BLOCKED"
                })
            }
        }
        req.user = payload;
        next();
    } catch (error: any) {
        res.status(401).json({ message: "Token expired" });
    }
}





