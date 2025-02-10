import mongoose, { Document, ObjectId, Schema } from "mongoose";

export enum InspectionType {
    BASIC = "basic",
    FULL = "full"
}

export enum TimeSlot {
    AFTER_NOON = "after-noon",
    BEFORE_NOON = "before-noon"
}

export interface IInspectionInput {
    user: ObjectId;                    // Reference to the user who made the booking
    vehicle: ObjectId;                 // Reference to the vehicle (changed from vehicleId string)
    inspector: ObjectId;               // Reference to the inspector (changed from inspectorId string)
    location: string;                  // Full location address (or formatted address)
    latitude: string;                  // Latitude coordinate as string
    longitude: string;                 // Longitude coordinate as string
    phone: string;                     // Phone number of the user (validated on the frontend)
    inspectionType: InspectionType;    // Either "basic" or "full"
    date: Date;                        // The date for the inspection
    timeSlot: TimeSlot;                // "before-noon" or "after-noon"
    confirmAgreement: boolean;         // Must be true to proceed
    paymentMethod: string;             // Payment method chosen by the user
    status?: string;                   // Optional status field (e.g., "pending", "confirmed", "paid")
    notes?: string;                    // Optional field for any extra notes or comments
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
        timeSlot: {
            type: String,
            enum: Object.values(TimeSlot),
            required: true,
        },
        confirmAgreement: { type: Boolean, required: true },
        paymentMethod: { type: String, required: true },
        status: { type: String, default: "pending" },
        notes: { type: String },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

export default mongoose.model<IInspectionDocument>("Inspection", InspectionSchema);