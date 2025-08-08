import { inject, injectable } from "inversify";
import { IInspectionTypeController } from "../core/interfaces/controllers/inspection-type.controller.interface";
import { TYPES } from "../di/types";
import { IInspectionTypeService } from "../core/interfaces/services/inspection-type.service.interface";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";
import { IInspectionTypeInput } from "../models/inspection-type.model";
import { toObjectId } from "../utils/toObjectId.utils";

injectable()
export class InspectionTypeController implements IInspectionTypeController {
    constructor(
        @inject(TYPES.InspectionTypeService) private _inspectionTypeService: IInspectionTypeService
    ) { }

    getAllInspectionTypes = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectionTypes = await this._inspectionTypeService.findAll()
            res.status(200).json({ data: inspectionTypes })
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

    getActiveInspectionTypes = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectionTypes = await this._inspectionTypeService.getActiveInspectionTypes()
            res.status(200).json({ data: inspectionTypes })
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
    getInspectionTypeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const inspectionType = await this._inspectionTypeService.findById(toObjectId(id))
            res.status(200).json({ data: inspectionType })
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
    createInspectionType = async (req: Request, res: Response): Promise<void> => {
        try {
            const inspectionTypeData: IInspectionTypeInput = req.body;
            const newInspectionType = await this._inspectionTypeService.createInspectionType(inspectionTypeData)
            res.status(200).json({ data: newInspectionType })
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

    updateInspectionType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData: Partial<IInspectionTypeInput> = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const updatedInspectionType = await this._inspectionTypeService.updateInspectionType(id, updateData)

            if (!updatedInspectionType) {
                res.status(404).json({
                    success: false,
                    message: 'Inspection type not found',
                    field: 'id'
                })
                return;
            }

            res.status(200).json({ data: updatedInspectionType })
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

    toggleInspectionTypeStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const updatedInspectionType = await this._inspectionTypeService.toggleInspectionTypeStatus(id)

            if (!updatedInspectionType) {
                res.status(404).json({
                    success: false,
                    message: 'Inspection type not found',
                    field: 'id'
                })
                return;
            }

            res.status(200).json({ data: updatedInspectionType })
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

    deleteInspectionType = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Inspection type id is required',
                    field: 'id'
                })
                return;
            }
            const deletedInspectionType = await this._inspectionTypeService.deleteInspectionType(toObjectId(id))

            if (!deletedInspectionType) {
                res.status(404).json({
                    success: false,
                    message: 'Inspection type not found',
                    field: 'id'
                })
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Inspection type deleted successfully',
                field: 'id'
            })
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