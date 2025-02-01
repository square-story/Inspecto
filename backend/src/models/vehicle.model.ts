import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    make: { type: String, required: true }, // Car Brand (Toyota, BMW, etc.)
    model: { type: String, required: true }, // Car Model (Corolla, X5, etc.)
    year: { type: Number, required: true }, // Manufacturing Year
    type: { type: String, enum: ["sedan", "suv", "truck", "bike"], required: true }, // Vehicle Type
    registrationNumber: { type: String, required: true, unique: true }, // Unique Registration Number
    chassisNumber: { type: String, required: true, unique: true }, // Chassis Number
    fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], required: true }, // Fuel Type
    transmission: { type: String, enum: ["manual", "automatic"], required: true }, // Transmission Type
    insuranceExpiry: { type: Date, required: true }, // Insurance Expiry Date
    lastInspectionDate: { type: Date }, // Last Inspection Date (optional)
    frontViewImage: { type: String }, // Stores image URL
    rearViewImage: { type: String },
}, { timestamps: true })


module.exports = mongoose.model("Vehicle", VehicleSchema);