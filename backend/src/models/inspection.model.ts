import mongoose, { Document, ObjectId, Schema } from "mongoose";

export enum InspectionType {
    BASIC = "basic",
    FULL = "full"
}

export enum InspectionStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    PAYMENT_PENDING = "payment_pending",
    PAYMENT_COMPLETED = "payment_completed"
}

// Adding timeSlot to track specific booking time
export interface IInspectionInput {
    user: ObjectId;
    vehicle: ObjectId;
    inspector: ObjectId;
    location: string;
    latitude: string;
    longitude: string;
    phone: string;
    inspectionType: InspectionType;
    date: Date;
    slotNumber: number;           // Track which slot was booked (1-10)
    bookingReference: string;     // Unique booking reference
    confirmAgreement: boolean;
    paymentMethod: string;
    status: InspectionStatus;
    notes?: string;
    version: number;              // For optimistic locking
}

export interface IInspectionDocument extends IInspectionInput, Document { }

const InspectionSchema: Schema = new Schema<IInspectionDocument>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        inspector: { type: Schema.Types.ObjectId, ref: "Inspector", required: true },
        location: { type: String, required: true },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        phone: { type: String, required: true },
        inspectionType: {
            type: String,
            enum: Object.values(InspectionType),
            required: true,
        },
        date: { type: Date, required: true },
        slotNumber: { type: Number, required: true },
        bookingReference: {
            type: String,
            required: true,
            unique: true
        },
        confirmAgreement: { type: Boolean, required: true },
        paymentMethod: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(InspectionStatus),
            default: InspectionStatus.PENDING
        },
        notes: { type: String },
        version: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

// compound index for slot uniqueness
InspectionSchema.index({ date: 1, inspector: 1, slotNumber: 1 }, { unique: true });

export default mongoose.model<IInspectionDocument>("Inspection", InspectionSchema);