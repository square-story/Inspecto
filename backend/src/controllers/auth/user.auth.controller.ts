import { Request, Response, RequestHandler, NextFunction } from "express";
import { UserAuthService } from "../../services/auth/user.auth.service";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const userAuthService = new UserAuthService()
export class UserAuthController {
    static userLogin: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const response = await userAuthService.login(email, password, res)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: 'some issue in the login section' })
            }
        }
    }
    static refreshToken: RequestHandler = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' })
                return
            }
            const accessToken = await userAuthService.refreshToken(refreshToken)
            res.status(200).json(accessToken)
        } catch (error) {
            if (error instanceof Error) {
                res.status(403).json({ message: error.message });
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        }
    }
    static registerUser: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, password, firstName, lastName } = req.body
            const response = await userAuthService.registerUser(email, password, firstName, lastName, res)
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
    static verifyOTP = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body
            const result = await userAuthService.verifyOTP(email, otp, res)
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }
    static resendOTP = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const result = await userAuthService.resendOTP(email);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    };
    static googleAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            const response = await userAuthService.googleLoginOrRegister(email, name, picture, family_name, res);
            res.status(200).json({ message: 'Authentication successful', response });
        } catch (error) {
            console.error('Google auth error:', error);
            res.status(500).json({ message: 'Authentication failed' });
        }
    };
    static forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, role } = req.body;
            const response = await userAuthService.forgetPassword(email, role)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ message: 'Server Error' })
        }
    }
    static resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token, email, password } = req.body
            const response = await userAuthService.resetPassword(token, email, password)
            res.status(200).json(response)
        } catch (error) {
            console.error('Error in reset password:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}