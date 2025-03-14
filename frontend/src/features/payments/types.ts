import { Inspection } from "../inspection/types";
import { UserState } from "../user/userSlice";


export enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export interface IPayments {
    _id: string;
    inspection: Inspection;
    user: UserState
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    status: PaymentStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}