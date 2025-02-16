import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export enum InspectorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DENIED = 'DENIED',
    BLOCKED = 'BLOCKED'
}

// Simplified day availability interface
export interface IDayAvailability {
    enabled: boolean;
    slots: number;
}

export type WeeklyAvailability = {
    Monday: IDayAvailability;
    Tuesday: IDayAvailability;
    Wednesday: IDayAvailability;
    Thursday: IDayAvailability;
    Friday: IDayAvailability;
    Saturday: IDayAvailability;
};

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
    availableSlots: WeeklyAvailability;
    // to track dates and remaining slots
    bookedSlots: {
        date: Date,
        slotsBooked: number,
        bookedBy: ObjectId[]
    }[];
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

// Simplified day availability schema
const DayAvailabilitySchema = new Schema<IDayAvailability>(
    {
        enabled: { type: Boolean, required: true, default: false },
        slots: { type: Number, required: true, default: 0, min: 0, max: 10 }
    },
    { _id: false }
);

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

    // Modified available slots structure
    availableSlots: {
        Monday: { type: DayAvailabilitySchema, required: true, default: { enabled: true, slots: 5 } },
        Tuesday: { type: DayAvailabilitySchema, required: true, default: { enabled: true, slots: 5 } },
        Wednesday: { type: DayAvailabilitySchema, required: true, default: { enabled: true, slots: 5 } },
        Thursday: { type: DayAvailabilitySchema, required: true, default: { enabled: true, slots: 5 } },
        Friday: { type: DayAvailabilitySchema, required: true, default: { enabled: true, slots: 5 } },
        Saturday: { type: DayAvailabilitySchema, required: true, default: { enabled: false, slots: 0 } },
    },
    bookedSlots: [{
        date: { type: Date, required: true },
        slotsBooked: { type: Number, required: true, min: 1 },
        bookedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
    }],

    isListed: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    approvedAt: { type: Date },
    deniedAt: { type: Date },
    denialReason: { type: String },

    coverageRadius: { type: Number, default: 10 },  // 10 km default
    serviceAreas: [{ type: String }],

    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
            type: [Number],
            default: [76.300288, 10.0368384], // [longitude, latitude]
            index: '2dsphere'
        }
    }
}, { timestamps: true });

export default mongoose.model<IInspector>("Inspector", InspectorSchema);