import Stripe from "stripe";
import appConfig from "../config/app.config";
import { IPaymentDocument, PaymentStatus } from "../models/payment.model";
import mongoose, { Types } from "mongoose";
import { InspectionStatus } from "../models/inspection.model";
import { BaseService } from "../core/abstracts/base.service";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";

export const stripe = new Stripe(appConfig.stripSecret, {
    apiVersion: '2025-01-27.acacia'
});

@injectable()
export class PaymentService extends BaseService<IPaymentDocument> implements IPaymentService {
    private readonly PENDING_TIMEOUT_MS = 15 * 60 * 1000;

    constructor(
        @inject(TYPES.PaymentRepository) private paymentRepository: IPaymentRepository,
        @inject(TYPES.InspectionRepository) private inspectionRepository: IInspectionRepository,
        @inject(TYPES.InspectionService) private inspectionService: IInspectionService,
    ) {
        super(paymentRepository);
    }

    private async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            return await stripe.paymentIntents.retrieve(paymentIntentId);
        } catch (error) {
            console.error(`Error retrieving payment intent ${paymentIntentId}:`, error);
            throw new Error('Failed to retrieve payment intent');
        }
    }

    private async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
        try {
            await stripe.paymentIntents.cancel(paymentIntentId);
            await this.paymentRepository.updatePayment(paymentIntentId, { status: PaymentStatus.FAILED });
        } catch (error) {
            console.error(`Error canceling payment intent ${paymentIntentId}:`, error);
            throw new Error('Failed to cancel payment intent');
        }
    }

    async createPaymentIntent(inspectionId: string, userId: string, amount: number, isRetry = false, paymentIntentId?: string): Promise<Stripe.PaymentIntent> {
        const existingPayments = await this.paymentRepository.findPendingByInspection(inspectionId);
        console.log('Existing payments found:', existingPayments);

        let reusableIntent: Stripe.PaymentIntent | null = null;

        for (const payment of existingPayments) {
            try {
                const intent = await this.retrievePaymentIntent(payment.stripePaymentIntentId);

                if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(intent.status)) {
                    reusableIntent = intent;
                    break;
                } else {
                    await this.cancelPaymentIntent(payment.stripePaymentIntentId);
                }
            } catch (error) {
                console.error(`Error processing payment ${payment.stripePaymentIntentId}:`, error);
                await this.paymentRepository.updatePayment(payment.stripePaymentIntentId, { status: PaymentStatus.FAILED });
            }
        }

        if (reusableIntent) {
            return reusableIntent;
        }

        if (isRetry && paymentIntentId) {
            try {
                const existingIntent = await this.retrievePaymentIntent(paymentIntentId);
                if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(existingIntent.status)) {
                    return existingIntent;
                } else {
                    throw new Error('Payment intent is not in a retryable state');
                }
            } catch (error) {
                console.error(`Error retrieving payment intent ${paymentIntentId}:`, error);
                throw new Error('Failed to retrieve payment intent for retry');
            }
        }

        const newPaymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            metadata: { inspectionId, userId },
            payment_method_types: ['card']
        });

        await this.paymentRepository.create({
            inspection: new Types.ObjectId(inspectionId),
            user: new Types.ObjectId(userId),
            amount,
            currency: 'inr',
            stripePaymentIntentId: newPaymentIntent.id,
            status: PaymentStatus.PENDING
        });

        return newPaymentIntent;
    }

    async handleWebhookEvent(event: Stripe.Event): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let payment;

            switch (event.type) {
                case "payment_intent.succeeded": {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    payment = await this.paymentRepository.updatePayment(paymentIntent.id, { status: PaymentStatus.SUCCEEDED });

                    if (!payment) {
                        throw new Error('Payment not found');
                    }

                    await this.inspectionRepository.update(payment.inspection, { status: InspectionStatus.CONFIRMED });
                    break;
                }

                case "payment_intent.payment_failed": {
                    const failedPayment = event.data.object as Stripe.PaymentIntent;
                    payment = await this.paymentRepository.updatePayment(failedPayment.id, { status: PaymentStatus.FAILED });

                    if (!payment) {
                        throw new Error('Payment not found');
                    }

                    await this.inspectionRepository.update(payment.inspection, { status: InspectionStatus.CANCELLED });
                    await this.inspectionService.cancelInspection(payment.inspection.toString());
                    break;
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error('Error handling webhook:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    async verifyPayment(paymentIntentId: string) {
        try {
            return await this.paymentRepository.getPaymentByIntentId(paymentIntentId);
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }

    async findPayments(userId: string) {
        try {
            return await this.paymentRepository.findUserPayments(userId);
        } catch (error) {
            console.error('Error getting payments data:', error);
            throw error;
        }
    }

    async handleStaleTransactions(): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const staleDate = new Date(Date.now() - this.PENDING_TIMEOUT_MS);
            const stalePayments = await this.paymentRepository.findStalePayments(PaymentStatus.PENDING, staleDate);

            for (const payment of stalePayments) {
                try {
                    const paymentIntent = await this.retrievePaymentIntent(payment.stripePaymentIntentId);

                    if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(paymentIntent.status)) {
                        await this.cancelPaymentIntent(payment.stripePaymentIntentId);
                    }

                    await this.paymentRepository.updatePayment(payment.stripePaymentIntentId, { status: PaymentStatus.FAILED });
                    await this.inspectionRepository.update(payment.inspection, { status: InspectionStatus.CANCELLED });
                    await this.inspectionService.cancelInspection(payment.inspection.toString());
                } catch (error) {
                    console.error(`Error handling stale payment ${payment.stripePaymentIntentId}:`, error);
                    continue;
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            console.error('Error handling stale transactions:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}
