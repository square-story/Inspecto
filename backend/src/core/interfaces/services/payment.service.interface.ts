import Stripe from "stripe";
import { IPaymentDocument } from "../../../models/payment.model";

export interface IPaymentService {
    createPaymentIntent(inspectionId: string, userId: string, amount: number, isRetry: boolean, paymentIntentId?: string): Promise<Stripe.PaymentIntent>;
    handleWebhookEvent(event: Stripe.Event): Promise<void>;
    verifyPayment(paymentIntentId: string): Promise<IPaymentDocument | null>;
    handleStaleTransactions(): Promise<void>;
    findPayments(userId: string): Promise<IPaymentDocument[]>;
    processInspectionPayment(inspectionId: string): Promise<{
        platformFee: number;
        inspectorEarnings: number;
    }>;
    cancelPayment(paymentIntentId: string, userId: string): Promise<void>;
    cancelSuccessfulPayment(paymentIntentId: string, userId: string): Promise<void>
}