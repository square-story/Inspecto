import { Request, Response } from 'express';
import { ServiceError } from '../core/errors/service.error';

export const errorHandler = (
    err: Error, req: Request, res: Response) => {
    // Handle ServiceError
    if (err instanceof ServiceError) {
        return res.status(err.statusCode).json({
            success: false,
            field: err.field,
            message: err.message
        });
    }

    // Handle other types of errors
    console.error('Unhandled Error:', err);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};