import { Request, Response } from "express";

export interface IWithDrawalController {
    requestWithdrawal: (req: Request, res: Response) => Promise<void>;
    getPendingWithdrawals: (req: Request, res: Response) => Promise<void>;
    processWithdrawal: (req: Request, res: Response) => Promise<void>;
    getInspectorWithdrawals: (req: Request, res: Response) => Promise<void>;
}