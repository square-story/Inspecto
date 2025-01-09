import { Request, Response } from "express";
import { AdminAuthService } from "../../services/auth/admin.auth.service";

const adminAuthService = new AdminAuthService();

export class AdminAuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const tokens = await adminAuthService.login(email, password, res)
            res.status(200).json(tokens)
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: "An unknown error occurred" });
            }
        }
    }
    static async refreshToken(req: Request, res: Response) {
        try {
            const { token } = req.body;
            const tokens = await adminAuthService.refreshToken(token)
            res.status(200).json(tokens)
        } catch (error) {
            if (error instanceof Error) {
                res.status(403).json({ message: error.message })
            } else {
                res.status(403).json({ message: 'forbidden' })
            }
        }
    }
}