import { Request, Response, RequestHandler } from "express";
import { UserAuthService } from "../../services/auth/user.auth.service";

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
            const result = await userAuthService.verifyOTP(email, otp)
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
}