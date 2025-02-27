import { Request, Response } from "express";
import { stripe } from "../services/payment.service";
import appConfig from "../config/app.config";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IPaymentController } from "../core/interfaces/controllers/payment.controller.interface";
import { ServiceError } from "../core/errors/service.error";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";

@injectable()
export class PaymentController implements IPaymentController {
    constructor(
        @inject(TYPES.PaymentService) private paymentService: IPaymentService
    ) { }

    createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectionId, amount } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const paymentIntent = await this.paymentService.createPaymentIntent(
                inspectionId,
                userId as string,
                amount
            );

            res.status(200).json({
                success: true,
                clientSecret: paymentIntent.client_secret
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

    handleWebhook = async (req: Request, res: Response): Promise<void> => {
        const sig = req.headers['stripe-signature'];

        try {
            if (!sig) {
                throw new Error('No Stripe signature found');
            }

            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                appConfig.stripWebhook
            );

            await this.paymentService.handleWebhookEvent(event);

            res.status(200).json({ received: true });
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

    verifyPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentIntentId } = req.params;

            const payment = await this.paymentService.verifyPayment(paymentIntentId);
            if (!payment) {
                res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            res.status(200).json({
                success: true,
                payment
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
    findPayments = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const response = await this.paymentService.find({ user: userId })

            if (!response) {
                res.status(404).json({
                    success: false,
                    message: "Not found any data"
                })
            }

            res.status(200).json({
                success: true,
                message: "Payment getted successfully",
                payments: response
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


