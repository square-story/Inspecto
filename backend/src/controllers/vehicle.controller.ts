import { Request, Response } from "express";
import VehicleService from "../services/vehicle.service";
import { IVehicleDocument } from "../models/vehicle.model";
import { ObjectId } from "mongoose";

export default class VehicleController {
    private vehicleService: VehicleService;

    constructor(vehicleService: VehicleService) {
        this.vehicleService = vehicleService;
    }

    async createVehicle(req: Request, res: Response): Promise<void> {
        try {
            const vehicleData: IVehicleDocument = req.body;
            const userId = req.user?.userId
            vehicleData.user = userId as unknown as ObjectId
            const vehicle = await this.vehicleService.createVehicle(vehicleData);
            res.status(201).json(vehicle);
        } catch (error) {
            res.status(500).json({ message: "Error creating vehicle", error });
        }
    }

    async getVehicleById(req: Request, res: Response): Promise<void> {
        try {
            const vehicle = await this.vehicleService.getVehicleById(req.params.vehicleId);
            if (!vehicle) {
                res.status(404).json({ message: "Vehicle not found" });
                return
            }
            res.json(vehicle);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving vehicle", error });
        }
    }

    async getVehiclesByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }
            const vehicles = await this.vehicleService.getVehiclesByUser(userId);
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user's vehicles", error });
        }
    }

    async updateVehicle(req: Request, res: Response): Promise<void> {
        try {
            const updatedVehicle = await this.vehicleService.updateVehicle(req.params.id, req.body);
            if (!updatedVehicle) res.status(404).json({ message: "Vehicle not found" });
            res.json(updatedVehicle);
        } catch (error) {
            res.status(500).json({ message: "Error updating vehicle", error });
        }
    }

    async deleteVehicle(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.vehicleService.deleteVehicle(req.params.vehicleId)
            if (!deleted) {
                res.status(404).json({ message: "Vehicle not found" });
                return
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting vehicle", error });
        }
    }
}

