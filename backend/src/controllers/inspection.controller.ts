import { Request, Response } from "express";
import { IInspectionInput } from "../models/inspection.model";
import { ObjectId } from "mongoose";
import { IInspectionController } from "../core/interfaces/controllers/inspection.controller.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { ServiceError } from "../core/errors/service.error";


@injectable()
export class InspectionController implements IInspectionController {
    constructor(
        @inject(TYPES.InspectionService) private _inspectionService: IInspectionService
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
            const inspection = await this._inspectionService.createInspection(inspectionData);
            res.status(201).json({
                success: true,
                data: inspection,
                message: "Inspection booking saved successfully.",
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
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
            const updatedInspection = await this._inspectionService.updateInspection(id as string, updateData);
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
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
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
            const inspection = await this._inspectionService.getInspectionById(inspectionId);
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
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectorId, date } = req.params;
            const slots = await this._inspectionService.getAvailableSlots(inspectorId, new Date(date));
            res.status(200).json({
                success: true,
                slots,
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
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
                inspections = await this._inspectionService.findInspections(userId as string);
            } else {
                inspections = await this._inspectionService.findInspectionsByInspector(userId as string)
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
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    getInspectorStates = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId

            const role = req.user?.role
            if (!inspectorId || !role) {
                res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
                return;
            }
            const response = await this._inspectionService.getStatsAboutInspector(inspectorId);
            res.status(200).json({
                success: true,
                response,
            });

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
}