import mongoose, { Schema, Document, ObjectId } from "mongoose";

/**
 * Enum for Vehicle Types
 */
export enum VehicleType {
    SEDAN = "sedan",
    SUV = "suv",
    TRUCK = "truck",
    MUSCLE = "muscle",
}

/**
 * Enum for Transmission Types
 */
export enum Transmission {
    MANUAL = "manual",
    AUTOMATIC = "automatic"
}

/**
 * Interface for Vehicle Input
 */
export interface IVehicleInput {
    user: ObjectId;
    make: string;
    vehicleModel: string;
    year: number;
    type: VehicleType;
    registrationNumber: string;
    chassisNumber: string;
    fuelType: "petrol" | "diesel" | "electric" | "hybrid";
    transmission: Transmission;
    insuranceExpiry: Date;
    lastInspectionDate?: Date;
    frontViewImage?: string;
    rearViewImage?: string;
}

/**
 * Interface for Vehicle Document (MongoDB Document)
 */
export interface IVehicleDocument extends IVehicleInput, Document { }

/**
 * Mongoose Schema for Vehicle
 */
const VehicleSchema: Schema = new Schema<IVehicleDocument>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User
    make: { type: String, required: true }, // Car Brand (Toyota, BMW, etc.)
    vehicleModel: { type: String, required: true }, // Car Model (Corolla, X5, etc.)
    year: { type: Number, required: true }, // Manufacturing Year
    type: { type: String, enum: Object.values(VehicleType), required: true }, // Vehicle Type (Enum)
    registrationNumber: { type: String, required: true, unique: true }, // Unique Registration Number
    chassisNumber: { type: String, required: true, unique: true }, // Chassis Number
    fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], required: true }, // Fuel Type
    transmission: { type: String, enum: Object.values(Transmission), required: true }, // Transmission Type
    insuranceExpiry: { type: Date, required: true }, // Insurance Expiry Date
    lastInspectionDate: { type: Date }, // Last Inspection Date (Optional)

    // New Fields for Vehicle Images
    frontViewImage: { type: String }, // Stores Front View Image URL
    rearViewImage: { type: String },  // Stores Rear View Image URL
}, { timestamps: true });

/**
 * Export Vehicle Model
 */
export default mongoose.model<IVehicleDocument>("Vehicle", VehicleSchema);
