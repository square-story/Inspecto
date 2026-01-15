import { Request, Response } from "express";
import { IUserAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { inject, injectable, } from "inversify";
import { TYPES } from "../../di/types";
import { ServiceError } from "../../core/errors/service.error";
import { IUserAuthService } from "../../core/interfaces/services/auth.service.interface";
import { HTTP_STATUS } from "../../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../../constants/http/response-messages";



@injectable()
export class UserAuthController implements IUserAuthController {

    constructor(
        @inject(TYPES.UserAuthService) private readonly _userAuthService: IUserAuthService
    ) { }



    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this._userAuthService.login(email, password);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            const response = { accessToken: accessToken, role: 'user', status: true }
            res.status(HTTP_STATUS.OK).json(response);
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    refreshToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.ERROR.REFRESH_TOKEN_MISSING });
                return;
            }
            const accessToken = await this._userAuthService.refreshToken(refreshToken);
            res.status(HTTP_STATUS.OK).json(accessToken);
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.FORBIDDEN,
                });
            }
        }
    }

    forgetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, role } = req.body;
            const response = await this._userAuthService.forgetPassword(email, role)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }



    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, firstName, lastName } = req.body
            const response = await this._userAuthService.registerUser(email, password, firstName, lastName)
            res.status(HTTP_STATUS.OK).json({
                response
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    verifyOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, otp } = req.body
            const { accessToken, message, refreshToken } = await this._userAuthService.verifyOTP(email, otp)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            const result = { accessToken, message }

            res.status(HTTP_STATUS.OK).json(result)
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    resendOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const result = await this._userAuthService.resendOTP(email);
            res.status(HTTP_STATUS.OK).json(result);
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, email, password } = req.body
            const response = await this._userAuthService.resetPassword(token, email, password)
            res.status(HTTP_STATUS.OK).json(response)
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    googleLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body;


            if (!token) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.TOKEN_MISSING });
                return;
            }

            const { refreshToken, accessToken, user } = await this._userAuthService.googleLoginOrRegister(token);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });

            if (!accessToken) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.ERROR.TOKEN_MISSING });
                return;
            }

            res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGES.SUCCESS.OPERATION_SUCCESSFUL, accessToken, status: user?.status });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
}