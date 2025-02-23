import { Request, Response } from "express";

export interface IInspectorController {
    getInspectorDetails(req: Request, res: Response): Promise<void>;
    updateInspectorDetails(req: Request, res: Response): Promise<void>;
    getAllInspectors(req: Request, res: Response): Promise<void>;
    changePassword(req: Request, res: Response): Promise<void>;
}