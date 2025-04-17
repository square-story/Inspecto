import mongoose, { Document, Schema } from "mongoose";

export interface IInspectionTypeFeature{
    text:string
}

export interface IInspectionTypeInput {
    name: string;
    price: number;
    platformFee: number;
    duration: string;
    features: string[];
    isActive: boolean;
}

export interface IInspectionTypeDocument extends IInspectionTypeInput, Document {}

const InspectionTypeSchema: Schema = new Schema<IInspectionTypeDocument>(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        platformFee: { type: Number, required: true },
        duration: { type: String, required: true },
        features: { type: [String], required: true },
        isActive: { type: Boolean, required: true, default: true },
    },
    { timestamps: true }
)

export const InspectionTypeModel = mongoose.model<IInspectionTypeDocument>(
    "InspectionType",
    InspectionTypeSchema
)