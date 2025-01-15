import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import appConfig from "../config/app.config";

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
        const payload = jwt.verify(token, appConfig.accessToken as string) as { userId: string; role: string };
        req.user = payload;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expired" });
        } else {
            res.status(403).json({ message: "Invalid token" });
        }
        console.error("JWT verification error:", error);
    }
}
