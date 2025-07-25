import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminController } from "../core/interfaces/controllers/admin.controller.interface";
import { TYPES } from "../di/types";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { ServiceError } from "../core/errors/service.error";
import { mapInspector } from "../dtos/implementations/inspector.dto";
import { mapUser } from "../dtos/implementations/user.dto";

@injectable()
export class AdminController implements IAdminController {

    constructor(
        @inject(TYPES.AdminService) private _adminService: IAdminService
    ) { }



    getAllInspectors = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this._adminService.getAllInspectors()
            res.status(200).json(response.map(inspector => mapInspector(inspector)))
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

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this._adminService.getAllUsers()
            res.status(200).json(response.map(user => mapUser(user)))
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

    getAdminDashboardStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this._adminService.getAdminDashboardStats()
            res.status(200).json(response)
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
