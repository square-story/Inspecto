import { Request, Response } from "express";
import paymentService, { stripe } from "../services/payment.service";
import appConfig from "../config/app.config";

export default class PaymentController {
    public async createPaymentIntent(req: Request, res: Response): Promise<Response> {
        try {
            const { inspectionId, amount } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const paymentIntent = await paymentService.createPaymentIntent(
                inspectionId,
                userId,
                amount
            );

            return res.status(200).json({
                success: true,
                clientSecret: paymentIntent.client_secret
            });
        } catch (error: any) {
            console.error('Error creating payment intent:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    public async handleWebhook(req: Request, res: Response): Promise<Response> {
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

            await paymentService.handleWebhookEvent(event);

            return res.status(200).json({ received: true });
        } catch (error: any) {
            console.error('Webhook error:', error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    public async verifyPayment(req: Request, res: Response): Promise<Response> {
        try {
            const { paymentIntentId } = req.params;

            const payment = await paymentService.verifyPayment(paymentIntentId);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            // Populate inspection details
            await payment.populate('inspection');

            return res.status(200).json({
                success: true,
                payment
            });
        } catch (error: any) {
            console.error('Error verifying payment:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    public async findPayments(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const response = await paymentService.findPayments(userId)

            if (!response) {
                return res.status(404).json({
                    success: false,
                    message: "Not found any data"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Payment getted successfully",
                payments: response
            })
        } catch (error: any) {
            console.error('Error verifying payment:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}


