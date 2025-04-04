import { Request, Response } from "express";

export interface IPaymentController {
    createPaymentIntent: (req: Request, res: Response) => Promise<void>;
    handleWebhook: (req: Request, res: Response) => Promise<void>;
    verifyPayment: (req: Request, res: Response) => Promise<void>;
    findPayments: (req: Request, res: Response) => Promise<void>;
    getWalletStates: (req: Request, res: Response) => Promise<void>;
    cancelPayment: (req: Request, res: Response) => Promise<void>;
    cancelSuccessfulPayment: (req: Request, res: Response) => Promise<void>;
}