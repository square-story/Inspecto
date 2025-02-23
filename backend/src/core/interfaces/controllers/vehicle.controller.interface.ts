import { Request, Response } from "express";

export interface IVehicleController {
    createVehicle(req: Request, res: Response): Promise<void>;
    updateVehicle(req: Request, res: Response): Promise<void>;
    getVehicleDetails(req: Request, res: Response): Promise<void>;
    getUserVehicles(req: Request, res: Response): Promise<void>;
    deleteVehicle(req: Request, res: Response): Promise<void>;
}