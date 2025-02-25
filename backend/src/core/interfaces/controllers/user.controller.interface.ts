import { Request, Response } from "express";
import { CustomRequest } from "../../types/custom.request.type";

export interface IUserController {
    getUserDetails: (req: Request, res: Response) => Promise<void>;
    updateUserDetails: (req: Request, res: Response) => Promise<void>;
    updateStatus: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<void>;
}