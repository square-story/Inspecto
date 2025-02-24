import { Request, Response } from "express";
import { UserAuthService } from "../../services/auth/user.auth.service";
import { OAuth2Client } from "google-auth-library";
import { IAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { inject, injectable, } from "inversify";
import { TYPES } from "../../di/types";

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
            const response = { accessToken: accessToken, role: 'user' }
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: 'Some issue in the login section' });
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
            if (error instanceof Error) {
                res.status(403).json({ message: error.message });
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        }
    }


    async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.cookies.refreshToken;
            await this.userAuthService.logout(token);
            res.clearCookie('refreshToken');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout' });
        }
    }

    async forgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, role } = req.body;
            const response = await this.userAuthService.forgetPassword(email, role)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Server Error" });
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
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
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
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }

    async resendOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const result = await this.userAuthService.resendOTP(email);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, email, password } = req.body
            const response = await this.userAuthService.resetPassword(token, email, password)
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in reset password:', error);
            res.status(500).json({ message: 'Server error' });
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
            console.error('Google auth error:', error);
            res.status(500).json({ message: 'Authentication failed' });
        }
    }
}