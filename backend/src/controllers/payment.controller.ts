import { Request, Response } from "express";
import { stripe } from "../services/payment.service";
import appConfig from "../config/app.config";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IPaymentController } from "../core/interfaces/controllers/payment.controller.interface";
import { ServiceError } from "../core/errors/service.error";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";

@injectable()
export class PaymentController implements IPaymentController {
    constructor(
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService
    ) { }

    createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { inspectionId, amount, isRetry, paymentIntentId } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED
                });
                return;
            }

            const paymentIntent = await this._paymentService.createPaymentIntent(inspectionId, userId as string, amount, isRetry, paymentIntentId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                clientSecret: paymentIntent.client_secret,
                message: 'Payment intent created successfully'
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
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

            await this._paymentService.handleWebhookEvent(event);

            res.status(HTTP_STATUS.OK).json({ received: true });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
                });
            }
        }
    }

    verifyPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentIntentId } = req.params;

            const payment = await this._paymentService.verifyPayment(paymentIntentId);
            if (!payment) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.NOT_FOUND
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                payment
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
                });
            }
        }
    }
    findPayments = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED
                });
                return;
            }
            const response = await this._paymentService.findPayments(userId)

            if (!response) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.NOT_FOUND
                })
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.SUCCESS.FETCHED,
                payments: response
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
                });
            }
        }
    }

    cancelPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentIntentId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED
                });
                return;
            }

            await this._paymentService.cancelPayment(paymentIntentId, userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Payment cancelled successfully'
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR
                });
            }
        }
    };
    cancelSuccessfulPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentIntentId } = req.params;
            const userId = req.user?.userId

            if (!userId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: "User Not Authenticated"
                });
                return;
            }

            await this._paymentService.cancelSuccessfulPayment(paymentIntentId, userId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.SUCCESS.OPERATION_SUCCESSFUL
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    }
}


