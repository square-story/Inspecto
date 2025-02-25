import { Request, Response } from "express";
import { IInspectionInput } from "../models/inspection.model";
import { ObjectId } from "mongoose";
import { IInspectionController } from "../core/interfaces/controllers/inspection.controller.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";


@injectable()
export class InspectionController implements IInspectionController {
    constructor(
        @inject(TYPES.InspectionService) private inspectionService: IInspectionService
    ) { }

    createInspection = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user?.userId
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            const inspectionData: IInspectionInput = req.body;
            const { inspectorId, vehicleId } = req.body
            inspectionData.user = user as unknown as ObjectId
            inspectionData.inspector = inspectorId as unknown as ObjectId
            inspectionData.vehicle = vehicleId as unknown as ObjectId
            const inspection = await this.inspectionService.createInspection(inspectionData);
            res.status(201).json({
                success: true,
                data: inspection,
                message: "Inspection booking saved successfully.",
            });
        } catch (error: any) {
            console.error("Error creating inspection:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    updateInspection = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.user?.userId;

            if (!id) {
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            const updateData: Partial<IInspectionInput> = req.body;
            const updatedInspection = await this.inspectionService.updateInspection(id as string, updateData);
            if (!updatedInspection) {
                res.status(404).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            res.status(200).json({
                success: true,
                inspection: updatedInspection,
                message: "Inspection updated successfully.",
            });
        } catch (error: any) {
            console.error("Error updating inspection:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    getInspectionById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectionId } = req.params

            if (!inspectionId) {
                res.status(404).json({
                    success: false,
                    message: "inspections not found.",
                });
            }
            const inspection = await this.inspectionService.getInspectionById(inspectionId);
            if (!inspection) {
                res.status(404).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            res.status(200).json({
                success: true,
                inspection,
            });
        } catch (error: any) {
            console.error("Error retrieving inspection:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectorId, date } = req.params;
            const slots = await this.inspectionService.getAvailableSlots(inspectorId, new Date(date));
            res.status(200).json({
                success: true,
                slots,
            });
        } catch (error: any) {
            console.error("Error retrieving slots:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    findInspections = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const role = req.user?.role
            if (!userId || !role) {
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            let inspections;
            if (role == 'user') {
                inspections = await this.inspectionService.findInspections(userId as string);
            } else {
                inspections = await this.inspectionService.findInspectionsByInspector(userId as string)
            }
            if (!inspections) {
                res.status(404).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            res.status(200).json({
                success: true,
                inspections,
            });
        } catch (error: any) {
            console.error("Error retrieving inspections Details:", error);
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}