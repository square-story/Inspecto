import { Request, Response } from "express";
import { inject, injectable, } from "inversify";
import { IInspectorAuthController } from "../../core/interfaces/controllers/auth.controller.interface";
import { TYPES } from "../../di/types";
import { IInspectorAuthService } from "../../core/interfaces/services/auth.service.interface";
import { ServiceError } from "../../core/errors/service.error";


@injectable()
export class InspectorAuthController implements IInspectorAuthController {
    constructor(
        @inject(TYPES.InspectorAuthService) private readonly _inspectorAuthService: IInspectorAuthService
    ) { }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body
            const { accessToken, refreshToken } = await this._inspectorAuthService.login(email, password)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
            });
            res.status(200).json({ accessToken: accessToken, role: 'inspector', status: true })
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
            const refreshToken = await req.cookies.refreshToken
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' })
                return
            }
            const response = await this._inspectorAuthService.refreshToken(refreshToken)
            res.status(200).json(response)
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
            const { email, role = 'inspector' } = req.body
            const response = await this._inspectorAuthService.forgetPassword(email, role)
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
            const { email, password, firstName, lastName, phone } = req.body
            const response = await this._inspectorAuthService.registerInspector(email, password, firstName, lastName, phone)
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
            const { accessToken, refreshToken, message } = await this._inspectorAuthService.verifyOTP(email, otp)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
            })
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
            const { email } = req.body
            const response = await this._inspectorAuthService.resendOTP(email)
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

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, email, password } = req.body
            const response = await this._inspectorAuthService.resetPassword(token, email, password)
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
}
