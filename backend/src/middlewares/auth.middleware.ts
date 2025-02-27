import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";
import { InspectorStatus } from "../models/inspector.model";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";
import { IUserService } from "../core/interfaces/services/user.service.interface";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
    interface Request {
        user?: { userId: string; role: string };
    }
}

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(TYPES.InspectorService) private inspectorService: IInspectorService,
        @inject(TYPES.UserService) private userService: IUserService
    ) { }

    authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Token missing" });
            return;
        }

        const token = authHeader.split(" ")[1];
        try {
            const payload = await verifyAccessToken(token) as unknown as { userId: string; role: string; }
            if (payload.role === 'inspector') {
                const inspector = await this.inspectorService.findById(new Types.ObjectId(payload.userId))
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
                const user = await this.userService.findById(new Types.ObjectId(payload.userId))
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
                    return;
                }
            }
            req.user = payload;
            next();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            res.status(401).json({ message: "Token expired" });
        }
    }

}



