import { Request, Response } from "express";

export interface IInspectorController {
    getInspectorDetails: (req: Request, res: Response) => Promise<void>;
    completeProfile: (req: Request, res: Response) => Promise<void>;
    approvalProfile: (req: Request, res: Response) => Promise<void>;
    denyProfile: (req: Request, res: Response) => Promise<void>;
    handleBlock: (req: Request, res: Response) => Promise<void>;
    updateInspector: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<void>;
    getNearbyInspectors: (req: Request, res: Response) => Promise<void>;
}