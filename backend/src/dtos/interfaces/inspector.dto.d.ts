import { Types } from "mongoose";
import { InspectorStatus, UnavailabilityPeriod, WeeklyAvailability } from "../../models/inspector.model";

export interface IInspectorDTO {
    _id: string; // Optional, as it may not be present in all inspector objects
    firstName: string;
    lastName: string;
    email: string;
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
    unavailabilityPeriods: UnavailabilityPeriod[];
    bookedSlots: {
        _id: Types.ObjectId;
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