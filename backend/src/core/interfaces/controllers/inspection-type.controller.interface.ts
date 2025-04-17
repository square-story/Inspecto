import { Request, Response } from "express";

export interface IInspectionTypeController {
    getAllInspectionTypes: (req: Request, res: Response) => Promise<void>;
    getActiveInspectionTypes: (req: Request, res: Response) => Promise<void>;
    getInspectionTypeById: (req: Request, res: Response) => Promise<void>;
    createInspectionType: (req: Request, res: Response) => Promise<void>;
    updateInspectionType: (req: Request, res: Response) => Promise<void>;
    toggleInspectionTypeStatus: (req: Request, res: Response) => Promise<void>;
    deleteInspectionType: (req: Request, res: Response) => Promise<void>;
};