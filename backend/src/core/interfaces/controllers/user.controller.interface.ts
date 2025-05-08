import { Request, Response } from "express";

export interface IUserController {
    getUserDetails: (req: Request, res: Response) => Promise<void>;
    updateUserDetails: (req: Request, res: Response) => Promise<void>;
    updateStatus: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<void>;
    getUserDashboard: (req: Request, res: Response) => Promise<void>;
}