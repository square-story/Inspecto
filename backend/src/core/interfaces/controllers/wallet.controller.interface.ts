import { Request, Response } from "express";

export interface IWalletController {
    getWalletStatsAboutInspector: (req: Request, res: Response) => Promise<void>;
    getWalletStatsAboutAdmin: (req: Request, res: Response) => Promise<void>;
    getWalletStatsAboutUser: (req: Request, res: Response) => Promise<void>;
}