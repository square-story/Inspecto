import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";
import { InspectorService } from "../services/inspector.service";
import { UserService } from "../services/user.service";
import { InspectorStatus } from "../models/inspector.model";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

declare module "express-serve-static-core" {
    interface Request {
        user?: { userId: string; role: string };
    }
}

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(TYPES.InspectorService) private inspectorService: InspectorService,
        @inject(TYPES.UserService) private userService: UserService
    ) { }

    authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Token missing" });
            return;
        }

        const token = authHeader.split(" ")[1];
        try {
            const payload = verifyAccessToken(token) as unknown as { userId: string; role: string; }
            if (payload.role === 'inspector') {
                const inspector = await this.inspectorService.getInspectorDetails(payload.userId)
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
                const user = await this.userService.findUserByUserId(payload.userId)
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



