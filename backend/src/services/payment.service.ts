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
        super(paymentRepository)
    }

    async createPaymentIntent(inspectionId: string, userId: string, amount: number, isRetry = false, paymentIntentId?: string): Promise<Stripe.PaymentIntent> {
        // Check for existing pending payments for this inspection
        const existingPayments = await this.paymentRepository.findPendingByInspection(inspectionId);

        console.log('the existing payment is founded!:', existingPayments)

        let reusableIntent: Stripe.PaymentIntent | null = null;

        // Check each existing payment for reusable intents
        for (const payment of existingPayments) {
            try {
                const intent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);

                if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(intent.status)) {
                    reusableIntent = intent;
                    break;
                } else {
                    // Cancel non-reusable intents
                    await stripe.paymentIntents.cancel(payment.stripePaymentIntentId);
                    await this.paymentRepository.updatePayment(
                        payment.stripePaymentIntentId,
                        { status: PaymentStatus.FAILED }
                    );
                }
            } catch (error) {
                console.error(`Error processing payment ${payment.stripePaymentIntentId}:`, error);
                await this.paymentRepository.updatePayment(
                    payment.stripePaymentIntentId,
                    { status: PaymentStatus.FAILED }
                );
            }
        }

        // Return reusable intent if found
        if (reusableIntent) {
            return reusableIntent;
        }

        // Handle retry logic
        if (isRetry && paymentIntentId) {
            try {
                const existingIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
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

        // Create new payment intent
        const newPaymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            metadata: { inspectionId, userId },
            payment_method_types: ['card']
        });

        // Create new payment record
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
                    payment = await this.paymentRepository.updatePayment(
                        paymentIntent.id,
                        { status: PaymentStatus.SUCCEEDED }
                    );

                    if (!payment) {
                        throw new Error('Payment not found');
                    }

                    await this.inspectionRepository.update(
                        payment.inspection,
                        { status: InspectionStatus.CONFIRMED }
                    );
                    break;
                }

                case "payment_intent.payment_failed": {
                    const failedPayment = event.data.object as Stripe.PaymentIntent;
                    payment = await this.paymentRepository.updatePayment(
                        failedPayment.id,
                        { status: PaymentStatus.FAILED }
                    );



                    if (!payment) {
                        throw new Error('Payment not found');
                    }

                    await this.inspectionRepository.update(
                        payment.inspection,
                        { status: InspectionStatus.CANCELLED }
                    );

                    await this.inspectionService.cancelInspection(payment.inspection.toString())
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
            return await this.paymentRepository.findUserPayments(userId)
        } catch (error) {
            console.error('Error getting payments data:', error);
            throw error;
        }
    }

    async handleStaleTransactions(): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            // Find payments that are pending for more than 1 hour
            const staleDate = new Date(Date.now() - this.PENDING_TIMEOUT_MS);
            const stalePayments = await this.paymentRepository.findStalePayments(
                PaymentStatus.PENDING,
                staleDate
            );

            for (const payment of stalePayments) {
                try {
                    // Retrieve the payment intent from Stripe
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        payment.stripePaymentIntentId
                    );

                    // If the payment is still pending in Stripe, cancel it
                    if (paymentIntent.status === 'requires_payment_method' ||
                        paymentIntent.status === 'requires_confirmation' ||
                        paymentIntent.status === 'requires_action') {

                        await stripe.paymentIntents.cancel(payment.stripePaymentIntentId);
                    }

                    // Update local payment status
                    await this.paymentRepository.updatePayment(
                        payment.stripePaymentIntentId,
                        { status: PaymentStatus.FAILED }
                    );

                    // Update inspection status
                    await this.inspectionRepository.update(
                        payment.inspection,
                        { status: InspectionStatus.CANCELLED }
                    );

                    // Cancel the inspection
                    await this.inspectionService.cancelInspection(payment.inspection.toString());

                } catch (error) {
                    console.error(`Error handling stale payment ${payment.stripePaymentIntentId}:`, error);
                    // Continue with other payments even if one fails
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
