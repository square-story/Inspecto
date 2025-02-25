import { Request, Response } from 'express';
import { IAuthController } from '../../core/interfaces/controllers/auth.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IAdminAuthService } from '../../core/interfaces/services/auth.service.interface';
import { AdminAuthService } from '../../services/auth/admin.auth.service';
import { ServiceError } from '../../core/errors/service.error';


@injectable()
export class AdminAuthController implements IAuthController {
    constructor(
        @inject(TYPES.AdminAuthService) private adminAuthService: AdminAuthService
    ) { }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.adminAuthService.login(email, password);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            const response = { accessToken: accessToken, role: 'admin', status: true }
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
            const refreshToken = await req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' });
                return;
            }
            const { accessToken } = await this.adminAuthService.refreshToken(refreshToken);
            res.status(200).json({ accessToken, status: true });
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
}