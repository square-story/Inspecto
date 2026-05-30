import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../core/errors/service.error';
import { HTTP_STATUS } from '../constants/http/status-codes';
import { RESPONSE_MESSAGES } from '../constants/http/response-messages';
import { responseUtils } from '../utils/response.utils';
import { ZodError } from 'zod';
import { AppError } from './context.middleware';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message
        }));
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }


    // Handle AppError
    if (err instanceof AppError) {
        return responseUtils.error(
            res,
            err.statusCode,
            err.message,
            err.field
        );
    }

    // Handle ServiceError
    if (err instanceof ServiceError) {
        return responseUtils.error(
            res,
            err.statusCode,
            err.message,
            err.field
        );
    }

    // Handle other types of errors
    console.error('Unhandled Error:', err);
    return responseUtils.error(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
    );
};