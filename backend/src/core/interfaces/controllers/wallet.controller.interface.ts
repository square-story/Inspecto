import { Request, Response } from "express";

export interface IWalletController {
    getWalletStatsAboutInspector: (req: Request, res: Response) => Promise<void>;
}