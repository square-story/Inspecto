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
import { IVehicleDocument } from "../models/vehicle.model";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";


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
                res.status(HTTP_STATUS.NOT_FOUND).json({
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
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                data: booking,
                amount: amount,
                remainingAmount: remainingAmount,
                walletDeduction: walletDeduction,
                message: "Inspection booking saved successfully.",
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    updateInspection = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.user?.userId;

            if (!id) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "User not found.",
                });
            }

            const updateData: Partial<IInspectionInput> = req.body;
            const updatedInspection = await this._inspectionService.updateInspection(id as string, updateData);
            if (!updatedInspection) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                inspection: updatedInspection,
                message: "Inspection updated successfully.",
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    getInspectionById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectionId } = req.params

            if (!inspectionId) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "inspections not found.",
                });
            }
            const inspection = await this._inspectionService.getInspectionById(inspectionId);
            if (!inspection) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                inspection,
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectorId, date } = req.params;
            const slots = await this._inspectionService.getAvailableSlots(inspectorId, new Date(date));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                slots,
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    findInspections = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const role = req.user?.role
            if (!userId || !role) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
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
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "Inspection not found.",
                });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                inspections,
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    getInspectorStates = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectorId = req.user?.userId

            const role = req.user?.role
            if (!inspectorId || !role) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "User not found.",
                });
                return;
            }
            const response = await this._inspectionService.getStatsAboutInspector(inspectorId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                response,
            });

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    submitInspectionReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const { reportData, id, isDraft } = req.body;
            if (!id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Inspection ID is required' });
                return;
            }
            const report = await this._inspectionService.getInspectionById(id)
            if (!report) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Inspection not found' });
                return;
            }
            report.vehicle as unknown as IVehicleDocument;
            if (report.report?.status == 'completed') {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Report already submitted' });
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
                    res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Populated inspection data not found' });
                    return;
                }
                const pdfBuffer = await generateInspectionPDF(populatedInspection);
                const publicId = `inspection_reports/${report.bookingReference}_${Date.now()}`;
                pdfUrl = await uploadToCloudinary(pdfBuffer, publicId, 'pdf');

                if (!pdfUrl) {
                    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to upload PDF to Cloudinary' });
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
                });

                await this._vehicleService.updateVehicle(String((report.vehicle as unknown as IVehicleDocument)._id), {
                    lastInspectionId: id,
                });
            }
            res.status(HTTP_STATUS.OK).json({
                message: isDraft ? 'Report saved as draft' : 'Report submitted successfully',
                pdfUrl
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: error instanceof Error ? error.message : RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
}