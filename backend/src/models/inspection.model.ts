import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { TimeSlot } from "./inspector.model";

export enum InspectionStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    PAYMENT_PENDING = "payment_pending",
    PAYMENT_COMPLETED = "payment_completed"
}

export enum ReportStatus {
    DRAFT = "draft",
    COMPLETED = "completed"
}

export interface IInspectionReport {
    mileage: string;
    exteriorCondition: 'excellent' | 'good' | 'fair' | 'poor';
    interiorCondition: 'excellent' | 'good' | 'fair' | 'poor';
    engineCondition: 'excellent' | 'good' | 'fair' | 'poor';
    tiresCondition: 'excellent' | 'good' | 'fair' | 'poor';
    lightsCondition: 'excellent' | 'good' | 'fair' | 'poor';
    brakesCondition: 'excellent' | 'good' | 'fair' | 'poor';
    suspensionCondition: 'excellent' | 'good' | 'fair' | 'poor';
    fuelLevel: 'empty' | 'quarter' | 'half' | 'threequarters' | 'full';
    additionalNotes?: string;
    recommendations?: string;
    passedInspection: boolean;
    photos?: string[];
    status: ReportStatus;
    submittedAt: Date;
    reportPdfUrl?: string;
    version: number;
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
    inspectionType: ObjectId;
    date: Date;        // Track which slot was booked (1-10)
    timeSlot: TimeSlot;
    bookingReference: string;     // Unique booking reference
    confirmAgreement: boolean;
    status: InspectionStatus;
    notes?: string;
    version: number;              // For optimistic locking
    report?: IInspectionReport;
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
            type: Schema.Types.ObjectId,
            ref: "InspectionType",
            required: true
        },
        date: { type: Date, required: true },
        timeSlot: {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isAvailable: { type: Boolean, required: true, default: true }
        },
        bookingReference: {
            type: String,
            required: true,
            unique: true
        },
        confirmAgreement: { type: Boolean, required: true },
        status: {
            type: String,
            enum: Object.values(InspectionStatus),
            default: InspectionStatus.PENDING
        },
        notes: { type: String },
        version: {
            type: Number,
            default: 0
        },
        report: {
            mileage: String,
            exteriorCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            interiorCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            engineCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            tiresCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            lightsCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            brakesCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            suspensionCondition: {
                type: String,
                enum: ['excellent', 'good', 'fair', 'poor']
            },
            fuelLevel: {
                type: String,
                enum: ['empty', 'quarter', 'half', 'threequarters', 'full']
            },
            additionalNotes: String,
            recommendations: String,
            passedInspection: Boolean,
            photos: [String],
            status: {
                type: String,
                enum: Object.values(ReportStatus),
                default: ReportStatus.DRAFT
            },
            submittedAt: Date,
            reportPdfUrl: String,
            version: {
                type: Number,
                default: 0
            }
        },
    },
    {
        timestamps: true,
    }
);

// compound index for slot uniqueness
InspectionSchema.index({ date: 1, inspector: 1 }, { unique: true, partialFilterExpression: { status: { $ne: InspectionStatus.CANCELLED } } });

export default mongoose.model<IInspectionDocument>("Inspection", InspectionSchema);