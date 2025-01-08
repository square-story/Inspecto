import { NextFunction, Request, Response } from "express";

export function authorizeRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}
