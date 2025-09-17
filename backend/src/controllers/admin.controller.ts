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
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const isListed = req.query.isListed !== undefined ? req.query.isListed === 'true' : undefined;

            const { users, total } = await this._adminService.getAllInspectors({
                page,
                limit,
                search,
                isListed
            });

            res.status(200).json({
                data: users.map(user => mapInspector(user)),
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
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

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const { users, total } = await this._adminService.getAllUsers({
                page,
                limit,
                search
            });
            res.status(200).json({
                data: users.map(user => mapUser(user)),
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
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
