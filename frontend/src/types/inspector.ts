import { TimeSlot } from "@/components/minimal-availability-picker";

export enum InspectorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DENIED = 'DENIED',
    BLOCKED = 'BLOCKED'
}

export interface IDayAvailability {
    enabled: boolean;
    slots: number;
    timeSlots: TimeSlot[];
}

export type WeeklyAvailability = {
    Monday: IDayAvailability;
    Tuesday: IDayAvailability;
    Wednesday: IDayAvailability;
    Thursday: IDayAvailability;
    Friday: IDayAvailability;
    Saturday: IDayAvailability;
};

export interface IInspector {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string | null;
    address: string;
    profile_image: string;
    status: InspectorStatus;
    role: string;
    certificates: string[];
    yearOfExp: number;
    phone: string;
    signature: string;
    specialization: string[];
    availableSlots: WeeklyAvailability;
    bookedSlots: {
        _id: string;
        date: Date;
        slotsBooked: number;
        bookedBy: string[];
    }[];
    unavailabilityPeriods: {
        startDate: Date;
        endDate: Date;
        reason: string;
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
        coordinates: number[];  // [longitude, latitude]
    };
}