import { Request, Response } from "express";
import { IInspectionInput, InspectionStatus } from "../models/inspection.model";
import { ObjectId } from "mongoose";
import { IInspectionController } from "../core/interfaces/controllers/inspection.controller.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { ServiceError } from "../core/errors/service.error";
import { generateInspectionPDF } from "../utils/pdf.utils";
import { uploadToCloudinary } from "../utils/cloudinary.utils";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { IVehicleService } from "../core/interfaces/services/vehicle.service.interface";


@injectable()
export class InspectionController implements IInspectionController {
    constructor(
        @inject(TYPES.InspectionService) private _inspectionService: IInspectionService,
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
        @inject(TYPES.VehicleService) private _vehicleService: IVehicleService
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
            const { booking, amount, remainingAmount, walletDeduction } = await this._inspectionService.createInspection(inspectionData);
            res.status(201).json({
                success: true,
                data: booking,
                amount: amount,
                remainingAmount: remainingAmount,
                walletDeduction: walletDeduction,
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

    submitInspectionReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { reportData, id, isDraft } = req.body;
            if (!id) {
                res.status(400).json({ message: 'Inspection ID is required' });
                return;
            }
            const report = await this._inspectionService.getInspectionById(id)
            if (!report) {
                res.status(404).json({ message: 'Inspection not found' });
                return;
            }
            if (report.report?.status == 'completed') {
                res.status(400).json({ message: 'Report already submitted' });
                return;
            }
            await this._inspectionService.updateInspection(id, {
                report: {
                    ...reportData,
                    status: isDraft ? 'draft' : 'completed'
                }
            });
            let pdfUrl = ''
            if (!isDraft) {
                const populatedInspection = await this._inspectionService.getInspectionById(
                    id,
                );
                if (!populatedInspection) {
                    res.status(404).json({ message: 'Populated inspection data not found' });
                    return;
                }
                const pdfBuffer = await generateInspectionPDF(populatedInspection);
                const publicId = `inspection_reports/${report.bookingReference}_${Date.now()}`;
                pdfUrl = await uploadToCloudinary(pdfBuffer, publicId, 'pdf');

                if (!pdfUrl) {
                    res.status(500).json({ message: 'Failed to upload PDF to Cloudinary' });
                    return;
                }

                await this._paymentService.processInspectionPayment(id)

                await this._inspectionService.updateInspection(id, {
                    status: InspectionStatus.COMPLETED,
                    report: {
                        ...reportData,
                        status: 'completed',
                        reportPdfUrl: pdfUrl
                    }
                })

                await this._vehicleService.updateVehicle(String(report.vehicle), {
                    lastInspectionId: id,
                });
            }
            res.status(200).json({
                message: isDraft ? 'Report saved as draft' : 'Report submitted successfully',
                pdfUrl
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