import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http/status-codes';

/**
 * Custom application error class
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public field?: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

/**
 * Middleware to require authenticated user
 * Should be used after auth middleware that sets req.user
 */
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.userId) {
        throw new AppError(
            HTTP_STATUS.UNAUTHORIZED,
            'User ID is missing from the token'
        );
    }
    next();
};

/**
 * Middleware to extract and validate user ID from token
 * Returns user ID or throws error
 */
export const getUserId = (req: Request): string => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(
            HTTP_STATUS.UNAUTHORIZED,
            'User ID is missing from the token'
        );
    }
    return userId;
};
