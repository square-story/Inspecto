import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.utils";

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token missing' })

    const token = authHeader.split(' ')[1]
    try {
        const payload = verifyAccessToken(token)
        req.user = payload
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Token' })
    }
}