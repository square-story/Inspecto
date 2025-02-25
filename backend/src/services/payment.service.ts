import Stripe from "stripe";
import appConfig from "../config/app.config";
import { IPaymentDocument, IPaymentInput, PaymentStatus } from "../models/payment.model";
import mongoose, { Types } from "mongoose";
import { InspectionStatus } from "../models/inspection.model";
import { BaseService } from "../core/abstracts/base.service";
import { IPaymentService } from "../core/interfaces/services/payment.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { PaymentRepository } from "../repositories/payment.repository";
import { InspectionRepository } from "../repositories/inspection.repository";
import { InspectionService } from "./inspection.service";

export const stripe = new Stripe(appConfig.stripSecret, {
    apiVersion: '2025-01-27.acacia'
});


@injectable()
export class PaymentService extends BaseService<IPaymentDocument> implements IPaymentService {
    private readonly PENDING_TIMEOUT_MS = 15 * 60 * 1000;
    constructor(
        @inject(TYPES.PaymentRepository) private paymentRepository: PaymentRepository,
        @inject(TYPES.InspectionRepository) private inspectionRepository: InspectionRepository,
        @inject(TYPES.InspectionService) private inspectionService: InspectionService,
    ) {
        super(paymentRepository)
    }
    async createPayment(data: IPaymentInput): Promise<IPaymentDocument> {
        return await this.create(data)
    }
    async updatePayment(paymentIntentId: string, data: Partial<IPaymentInput>): Promise<IPaymentDocument | null> {
        return await this.update(new Types.ObjectId(paymentIntentId), data)
    }
    async getUserPayments(userId: string): Promise<IPaymentDocument[]> {
        return await this.find({ user: userId })
    }


    async createPaymentIntent(inspectionId: string, userId: string, amount: number): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'inr',
                metadata: {
                    inspectionId,
                    userId
                }
            });

            await this.paymentRepository.createPayment({
                inspection: new Types.ObjectId(inspectionId),
                user: new Types.ObjectId(userId),
                amount: amount,
                currency: 'inr',
                stripePaymentIntentId: paymentIntent.id,
                status: PaymentStatus.PENDING
            });

            return paymentIntent;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
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

                    await this.inspectionRepository.updateInspection(
                        payment.inspection.toString(),
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

                    await this.inspectionRepository.updateInspection(
                        payment.inspection.toString(),
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
                    await this.inspectionRepository.updateInspection(
                        payment.inspection.toString(),
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
