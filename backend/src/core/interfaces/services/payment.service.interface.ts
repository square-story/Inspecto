import Stripe from "stripe";
import { IPaymentDocument } from "../../../models/payment.model";
import { IBaseService } from "./base/base.service.interface";

export interface IPaymentService extends IBaseService<IPaymentDocument> {
    createPaymentIntent(inspectionId: string, userId: string, amount: number, isRetry: boolean, paymentIntentId?: string): Promise<Stripe.PaymentIntent>;
    handleWebhookEvent(event: Stripe.Event): Promise<void>;
    verifyPayment(paymentIntentId: string): Promise<IPaymentDocument | null>;
    handleStaleTransactions(): Promise<void>;
    findPayments(userId: string): Promise<IPaymentDocument[]>;
}