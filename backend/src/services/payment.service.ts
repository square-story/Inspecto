import Stripe from "stripe";
import appConfig from "../config/app.config";
import PaymentRepository from "../repositories/payment.repository";
import { PaymentStatus } from "../models/payment.model";
import mongoose from "mongoose";
import inspectionService from "./inspection.service";
import { InspectionStatus } from "../models/inspection.model";

export const stripe = new Stripe(appConfig.stripSecret, {
    apiVersion: '2025-01-27.acacia'
});

class PaymentService {
    private paymentRepository: PaymentRepository;

    constructor() {
        this.paymentRepository = new PaymentRepository();
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
                inspection: inspectionId as any,
                user: userId as any,
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

                    await inspectionService.updateInspection(
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

                    await inspectionService.updateInspection(
                        payment.inspection.toString(),
                        { status: InspectionStatus.CANCELLED }
                    );

                    await inspectionService.cancelInspection(payment.inspection.toString())
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
}

export default new PaymentService();