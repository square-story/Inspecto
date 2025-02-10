import mongoose, { Schema, Document, ObjectId } from 'mongoose'


export enum InspectorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DENIED = 'DENIED',
    BLOCKED = 'BLOCKED'
}


export interface IInspectorInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string | null;
    address: string;
    profile_image: string;
    status: InspectorStatus;
    role: string;
    certificates: [string];
    yearOfExp: number;
    phone: string;
    signature: string;
    specialization: [string];
    start_time: string;
    end_time: string;
    availableSlots: { date: Date, timeSlots: [string] }[];
    bookedSlots: { date: Date, timeSlot: string, bookedBy: ObjectId }[];
    available_days: number;
    isListed: boolean;
    isCompleted: boolean;
    approvedAt?: Date;
    deniedAt?: Date;
    denialReason?: string;
    coverageRadius: number;
    serviceAreas: string[];
    createdAt: Date;
    updatedAt: Date;
    location: {
        type: string;
        coordinates: [number];  // [longitude, latitude]
    };
}

export interface IInspector extends Document, IInspectorInput {
    _id: ObjectId
}

const InspectorSchema: Schema = new Schema<IInspector>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    profile_image: { type: String },
    status: { type: String, enum: InspectorStatus, default: InspectorStatus.PENDING },
    role: { type: String, default: 'inspector' },
    certificates: { type: [String] },
    yearOfExp: { type: Number },
    phone: { type: String, required: true },
    signature: { type: String },
    specialization: { type: [String] },
    start_time: { type: String },
    end_time: { type: String },

    availableSlots: [{ date: Date, timeSlots: [String] }],
    bookedSlots: [{ date: Date, timeSlot: String, bookedBy: { type: Schema.Types.ObjectId, ref: "User" } }],

    available_days: { type: Number },
    isListed: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    approvedAt: { type: Date },
    deniedAt: { type: Date },
    denialReason: { type: String },

    coverageRadius: { type: Number, default: 10 },  // 10 km default
    serviceAreas: [{ type: String }],

    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    }

}, { timestamps: true });

export default mongoose.model<IInspector>("Inspector", InspectorSchema);