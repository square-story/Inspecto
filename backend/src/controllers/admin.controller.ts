import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminController } from "../core/interfaces/controllers/admin.controller.interface";
import { TYPES } from "../di/types";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";

@injectable()
export class AdminController implements IAdminController {

    constructor(
        @inject(TYPES.AdminService) private adminService: IAdminService
    ) { }

    getAllInspectors = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.adminService.getAllInspectors()
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json("Internal server Error")
            }
        }
    }

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await this.adminService.getAllUsers()
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json("intenal server error")
            }
        }
    }
}
