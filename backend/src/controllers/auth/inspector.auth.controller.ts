import { Request, Response, RequestHandler, NextFunction } from "express";
import { InspectorAuthService } from "../../services/auth/inspector.auth.service";
const inspectorAuthService = new InspectorAuthService()
export class InspectorAuthController {
    static inspectorLogin: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const response = await inspectorAuthService.loginOfInspector(email, password, res)
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
            const { token } = req.body
            const response = await inspectorAuthService.refreshToken(token)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: 'some issue in the login section' })
            }
        }
    }
    static registerInspector: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, password, firstName, lastName, phone } = req.body
            const response = await inspectorAuthService.registerInspector(email, password, firstName, lastName, phone)
            res.status(200).json({
                response
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: 'some issue in the login section' })
            }
        }
    }
    static verifyOTP: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body
            const result = await inspectorAuthService.verifyOTP(email, otp, res)
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }
    static resendOTP: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            const response = await inspectorAuthService.resendOTP(email)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }
    static forgetPassword: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { email, role = 'inspector' } = req.body
            const response = await inspectorAuthService.forgetPassword(email, role)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }
    static resetPassword: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { token, email, password } = req.body
            const response = await inspectorAuthService.resetPassword(token, email, password)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }

}
