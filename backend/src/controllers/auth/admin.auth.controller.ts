import { Request, Response } from 'express';
import { IAuthController } from '../../core/interfaces/controllers/auth.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { controller, httpPost } from 'inversify-express-utils';
import { IAuthService } from '../../core/interfaces/services/auth.service.interface';
import { AdminAuthService } from '../../services/auth/admin.auth.service';


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

            res.status(200).json(accessToken);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: "An unknown error occurred" });
            }
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = await req.cookies.refreshToken; // Get the refresh token from the HTTP-only cookie
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' });
                return;
            }
            const { accessToken } = await this.adminAuthService.refreshToken(refreshToken);
            res.status(200).json({ accessToken, status: true });
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
            await this.adminAuthService.logout(token);
            res.clearCookie('refreshToken');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout' });
        }
    }
}