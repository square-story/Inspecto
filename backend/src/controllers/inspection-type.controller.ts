import { inject, injectable } from "inversify";
import { IInspectionTypeController } from "../core/interfaces/controllers/inspection-type.controller.interface";
import { TYPES } from "../di/types";
import { IInspectionTypeService } from "../core/interfaces/services/inspection-type.service.interface";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";
import { IInspectionTypeInput } from "../models/inspection-type.model";
import { toObjectId } from "../utils/toObjectId.utils";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";

injectable()
export class InspectionTypeController implements IInspectionTypeController {
    constructor(
        @inject(TYPES.InspectionTypeService) private _inspectionTypeService: IInspectionTypeService
    ) { }

    getAllInspectionTypes = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectionTypes = await this._inspectionTypeService.findAll()
            res.status(HTTP_STATUS.OK).json({ data: inspectionTypes })
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

    getActiveInspectionTypes = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectionTypes = await this._inspectionTypeService.getActiveInspectionTypes()
            res.status(HTTP_STATUS.OK).json({ data: inspectionTypes })
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
    getInspectionTypeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const inspectionType = await this._inspectionTypeService.findById(toObjectId(id))
            res.status(HTTP_STATUS.OK).json({ data: inspectionType })
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
    createInspectionType = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectionTypeData: IInspectionTypeInput = req.body;
            const newInspectionType = await this._inspectionTypeService.createInspectionType(inspectionTypeData)
            res.status(HTTP_STATUS.OK).json({ data: newInspectionType })
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

    updateInspectionType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData: Partial<IInspectionTypeInput> = req.body;
            if (!id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const updatedInspectionType = await this._inspectionTypeService.updateInspectionType(id, updateData)

            if (!updatedInspectionType) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Inspection type not found',
                    field: 'id'
                })
                return;
            }

            res.status(HTTP_STATUS.OK).json({ data: updatedInspectionType })
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

    toggleInspectionTypeStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const updatedInspectionType = await this._inspectionTypeService.toggleInspectionTypeStatus(id)

            if (!updatedInspectionType) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Inspection type not found',
                    field: 'id'
                })
                return;
            }

            res.status(HTTP_STATUS.OK).json({ data: updatedInspectionType })
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

    deleteInspectionType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const deletedInspectionType = await this._inspectionTypeService.deleteInspectionType(toObjectId(id))

            if (!deletedInspectionType) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Inspection type not found',
                    field: 'id'
                })
                return;
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Inspection type deleted successfully',
                field: 'id'
            })
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
}