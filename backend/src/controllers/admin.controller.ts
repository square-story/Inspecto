import { Request, RequestHandler, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminController } from "../core/interfaces/controllers/admin.controller.interface";
import { TYPES } from "../di/types";
import { AdminService } from "../services/admin.service";

@injectable()
export class AdminController implements IAdminController {

    constructor(
        @inject(TYPES.AdminService) private adminService: AdminService
    ) { }

    async getAllInspectors(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.adminService.getAllInspectors()
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json("Internal server Error")
            }
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
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
