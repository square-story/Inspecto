import { Request, RequestHandler, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService()

export class AdminController {
    static getAllInspectors: RequestHandler = async (req: Request, res: Response) => {
        try {
            const response = await adminService.getAllInspectors()
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json("Internal server Error")
            }
        }
    }
    static getAllUsers: RequestHandler = async (req: Request, res: Response) => {
        try {
            const response = await adminService.getAllUsers()
            res.status(200).json(response)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json("intenal server error")
            }
        }
    }
}
