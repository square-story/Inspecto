import mongoose, { Document, Schema, Types } from "mongoose";

export enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    REFUNDED = "refunded"
}

export interface IPaymentInput {
    inspection: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    currency: string;
    stripePaymentIntentId: string;
    status: PaymentStatus;
    metadata?: Record<string, unknown>;
}

export interface IPaymentDocument extends IPaymentInput, Document { }


const PaymentSchema = new Schema<IPaymentDocument>(
    {
        inspection: { type: Schema.Types.ObjectId, ref: "Inspection", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: "inr" },
        stripePaymentIntentId: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING
        },
        metadata: { type: Schema.Types.Mixed }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IPaymentDocument>("Payment", PaymentSchema);