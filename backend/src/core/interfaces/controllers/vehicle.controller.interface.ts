import { Request, Response } from "express";

export interface IVehicleController {
    createVehicle: (req: Request, res: Response) => Promise<void>;
    getVehicleById: (req: Request, res: Response) => Promise<void>;
    getVehiclesByUser: (req: Request, res: Response) => Promise<void>;
    updateVehicle: (req: Request, res: Response) => Promise<void>;
    deleteVehicle: (req: Request, res: Response) => Promise<void>;
}