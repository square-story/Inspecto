import { Request, Response } from "express";

export interface IInspectionController {
    createInspection: (req: Request, res: Response) => Promise<void>;
    updateInspection: (req: Request, res: Response) => Promise<void>;
    getInspectionById: (req: Request, res: Response) => Promise<void>;
    getAvailableSlots: (req: Request, res: Response) => Promise<void>;
    findInspections: (req: Request, res: Response) => Promise<void>;
}