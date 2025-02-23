import { Request, Response } from "express";

export interface IAdminController {
    getAllInspectors(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
}