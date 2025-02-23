import { Request, Response } from "express";

export interface IAuthController {
    login(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
}