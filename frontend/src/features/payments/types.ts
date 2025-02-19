import { Inspection } from "../inspection/types";


export enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export interface IPayments {
    _id: string;
    inspection: Inspection;
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    status: PaymentStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}