import { Request, Response } from "express";
import { inject, injectable, } from "inversify";
import { IAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { TYPES } from "../../di/types";
import { IInspectorAuthService } from "../../core/interfaces/services/auth.service.interface";


@injectable()
export class InspectorAuthController implements IAuthController {
    constructor(
        @inject(TYPES.InspectorAuthService) private readonly inspectorAuthService: IInspectorAuthService
    ) { }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const { accessToken, refreshToken } = await this.inspectorAuthService.login(email, password)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.status(200).json(accessToken)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: 'some issue in the login section' })
            }
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = await req.cookies.refreshToken
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' })
                return
            }
            const accessToken = await this.inspectorAuthService.refreshToken(refreshToken)
            res.status(200).json(accessToken)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message })
            } else {
                res.status(400).json({ message: 'some issue in the login section' })
            }
        }
    }


    async forgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, role = 'inspector' } = req.body
            const response = await this.inspectorAuthService.forgetPassword(email, role)
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, firstName, lastName, phone } = req.body
            const response = await this.inspectorAuthService.registerInspector(email, password, firstName, lastName, phone)
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


    async verifyOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body
            const { accessToken, refreshToken, message } = await this.inspectorAuthService.verifyOTP(email, otp)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })
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
            const { email } = req.body
            const response = await this.inspectorAuthService.resendOTP(email)
            res.status(200).json(response)
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
            const response = await this.inspectorAuthService.resetPassword(token, email, password)
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
