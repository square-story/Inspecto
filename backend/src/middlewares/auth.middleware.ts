import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import appConfig from "../config/app.config";
import { verifyAccessToken } from "../utils/token.utils";

declare module "express-serve-static-core" {
    interface Request {
        user?: { userId: string; role: string }; // Extend the type to include user information
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token missing" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyAccessToken(token) as unknown as { userId: string; role: string; }
        req.user = payload;
        next();
    } catch (error: any) {
        res.status(401).json({ message: "Token expired" });
    }
}
