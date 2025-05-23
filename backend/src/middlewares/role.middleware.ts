import { NextFunction, Request, RequestHandler, Response } from "express";

export function authorizeRole(...roles: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return
        }
        if (!roles.includes(req.user?.role)) {
            res.status(403).json({ message: "Access denied" });
            return
        }

        next();
    };
}
