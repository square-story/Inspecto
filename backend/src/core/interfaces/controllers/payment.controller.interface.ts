import { Request, Response } from "express";

export interface IPaymentController {
    createPayment(req: Request, res: Response): Promise<void>;
    handleWebhook(req: Request, res: Response): Promise<Response>;
    getUserPayments(req: Request, res: Response): Promise<void>;
}