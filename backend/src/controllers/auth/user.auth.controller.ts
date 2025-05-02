import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { IUserAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { inject, injectable, } from "inversify";
import { TYPES } from "../../di/types";
import { ServiceError } from "../../core/errors/service.error";
import { IUserAuthService } from "../../core/interfaces/services/auth.service.interface";
import appConfig from "../../config/app.config";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

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
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            const response = { accessToken: accessToken, role: 'user', status: true }
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    refreshToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' });
                return;
            }
            const accessToken = await this._userAuthService.refreshToken(refreshToken);
            res.status(200).json(accessToken);
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(403).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: 'forbidden',
                });
            }
        }
    }

    forgetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, role } = req.body;
            const response = await this._userAuthService.forgetPassword(email, role)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }



    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, firstName, lastName } = req.body
            const response = await this._userAuthService.registerUser(email, password, firstName, lastName)
            res.status(200).json({
                response
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
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
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            const result = { accessToken, message }

            res.status(200).json(result)
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    resendOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const result = await this._userAuthService.resendOTP(email);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, email, password } = req.body
            const response = await this._userAuthService.resetPassword(token, email, password)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    googleLogin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body;


            if (!token) {
                res.status(400).json({ message: 'Token is required' });
                return;
            }

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: appConfig.googleClientId,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                res.status(400).json({ message: 'Invalid Google token' });
                return;
            }
            const { email, name, picture, family_name } = payload;
            if (!email || !name || !picture) {
                res.status(400).json({ message: 'Missing required Google account information' });
                return;
            }
            const { refreshToken, accessToken, user } = await this._userAuthService.googleLoginOrRegister(email, name, picture, family_name);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            if (!accessToken) {
                res.status(400).json({ message: 'Access token is missing' });
                return;
            }

            res.status(200).json({ message: 'Authentication successful', accessToken, status: user?.status });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
}