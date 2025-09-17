import { Request, Response } from 'express';
import { ServiceError } from '../core/errors/service.error';
import { HTTP_STATUS } from '../constants/http/status-codes';
import { RESPONSE_MESSAGES } from '../constants/http/response-messages';
import { responseUtils } from '../utils/response.utils';

export const errorHandler = (
    err: Error, req: Request, res: Response) => {
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