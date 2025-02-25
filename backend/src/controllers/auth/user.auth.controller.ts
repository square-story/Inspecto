import { Request, Response } from "express";
import { UserAuthService } from "../../services/auth/user.auth.service";
import { OAuth2Client } from "google-auth-library";
import { IAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { inject, injectable, } from "inversify";
import { TYPES } from "../../di/types";
import { ServiceError } from "../../core/errors/service.error";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@injectable()
export class UserAuthController implements IAuthController {

    constructor(
        @inject(TYPES.UserAuthService) private userAuthService: UserAuthService
    ) { }



    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.userAuthService.login(email, password);
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

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' });
                return;
            }
            const accessToken = await this.userAuthService.refreshToken(refreshToken);
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

    async forgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, role } = req.body;
            const response = await this.userAuthService.forgetPassword(email, role)
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



    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, firstName, lastName } = req.body
            const response = await this.userAuthService.registerUser(email, password, firstName, lastName, res)
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

    async verifyOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body
            const { accessToken, message, refreshToken } = await this.userAuthService.verifyOTP(email, otp)
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

    async resendOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await this.userAuthService.resendOTP(email);
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

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, email, password } = req.body
            const response = await this.userAuthService.resetPassword(token, email, password)
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

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.body;

            if (!token) {
                res.status(400).json({ message: 'Token is required' });
                return;
            }

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                res.status(400).json({ message: 'Invalid Google token' });
                return;
            }
            const { email, name, picture, family_name } = payload;
            const { refreshToken, accessToken, user } = await this.userAuthService.googleLoginOrRegister(email, name, picture, family_name);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })
            res.status(200).json({ message: 'Authentication successful', response: { accessToken, user }, status: user?.status });
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