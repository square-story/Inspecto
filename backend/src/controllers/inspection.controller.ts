import { Request, Response } from "express";
import { IInspectionDocument, IInspectionInput } from "../models/inspection.model";
import inspectionService from "../services/inspection.service";
import { ObjectId } from "mongoose";


export default class InspectionController {
    public async createInspection(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user?.userId
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            const inspectionData: IInspectionInput = req.body;
            const { inspectorId, vehicleId } = req.body
            inspectionData.user = user as unknown as ObjectId
            inspectionData.inspector = inspectorId as unknown as ObjectId
            inspectionData.vehicle = vehicleId as unknown as ObjectId
            const inspection = await inspectionService.createInspection(inspectionData);
            return res.status(201).json({
                success: true,
                data: inspection,
                message: "Inspection booking saved successfully.",
            });
        } catch (error: any) {
            console.error("Error creating inspection:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }


    public async updateInspection(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.user?.userId;

            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            const updateData: Partial<IInspectionInput> = req.body;
            const updatedInspection = await inspectionService.updateInspection(id, updateData);
            if (!updatedInspection) {
                return res.status(404).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            return res.status(200).json({
                success: true,
                inspection: updatedInspection,
                message: "Inspection updated successfully.",
            });
        } catch (error: any) {
            console.error("Error updating inspection:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }


    public async getInspectionById(req: Request, res: Response): Promise<Response> {
        try {
            const { inspectionId } = req.params

            if (!inspectionId) {
                return res.status(404).json({
                    success: false,
                    message: "inspections not found.",
                });
            }
            const inspection = await inspectionService.getInspectionById(inspectionId);
            if (!inspection) {
                return res.status(404).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            return res.status(200).json({
                success: true,
                inspection,
            });
        } catch (error: any) {
            console.error("Error retrieving inspection:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    public async getAvailableSlots(req: Request, res: Response): Promise<Response> {
        try {
            const { inspectorId, date } = req.params;
            const slots = await inspectionService.getAvailableSlots(inspectorId, new Date(date));
            return res.status(200).json({
                success: true,
                slots,
            });
        } catch (error: any) {
            console.error("Error retrieving slots:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    public async findInspections(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId
            const role = req.user?.role
            if (!userId || !role) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }
            let inspections;
            if (role == 'user') {
                inspections = await inspectionService.findInspections(userId);
            } else {
                inspections = await inspectionService.findInspectionsByInspector(userId)
            }
            if (!inspections) {
                return res.status(404).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            return res.status(200).json({
                success: true,
                inspections,
            });
        } catch (error: any) {
            console.error("Error retrieving inspections Details:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}