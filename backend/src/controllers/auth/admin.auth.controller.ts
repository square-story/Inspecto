import { Request, Response, RequestHandler } from 'express';
import { AdminAuthService } from '../../services/auth/admin.auth.service';

const adminAuthService = new AdminAuthService();

export class AdminAuthController {
    static login: RequestHandler = async (req, res) => {
        try {
            const { email, password } = req.body;
            const tokens = await adminAuthService.login(email, password, res);
            res.status(200).json(tokens);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: "An unknown error occurred" });
            }
        }
    };

    static refreshToken: RequestHandler = async (req, res) => {
        try {
            const refreshToken = await req.cookies.refreshToken; // Get the refresh token from the HTTP-only cookie
            if (!refreshToken) {
                res.status(401).json({ message: 'Refresh token missing' });
                return;
            }
            const newAccessToken = await adminAuthService.refreshToken(refreshToken);
            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            if (error instanceof Error) {
                res.status(403).json({ message: error.message });
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        }
    };
}