import { Request, Response } from "express";

export interface IInspectionController {
    createInspection(req: Request, res: Response): Promise<Response>;
    updateInspection(req: Request, res: Response): Promise<Response>;
    getInspectionDetails(req: Request, res: Response): Promise<Response>;
    getUserInspections(req: Request, res: Response): Promise<Response>;
    getInspectorInspections(req: Request, res: Response): Promise<Response>;
    getAvailableSlots(req: Request, res: Response): Promise<Response>;
}