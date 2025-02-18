import { InspectorState } from "../inspector/inspectorSlice";
import { Vehicle } from "../vehicle/vehicleSlice";

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


export interface Inspection {
    _id: string,
    location: string;
    latitude: string;
    longitude: string;
    phone: string;
    inspectionType: InspectionType;
    date: Date;
    slotNumber: number;
    confirmAgreement: boolean;
    status: InspectionStatus;
    notes?: string;
    version: number;
    vehicle: Vehicle;
    inspector: InspectorState;
    bookingReference: string;
}

