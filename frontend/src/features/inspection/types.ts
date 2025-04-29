import { IInspector } from "@/types/inspector";
import { UserState } from "../user/userSlice";
import { Vehicle } from "../vehicle/vehicleSlice";

export interface IInspectionType {
    _id: string;
    name: string;
    price: number;
    platformFee: number;
    duration: string;
    features: string[];
    isActive: boolean;
}

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

export interface Inspection {
    _id: string,
    location: string;
    latitude: string;
    longitude: string;
    phone: string;
    inspectionType: IInspectionType;
    date: Date;
    slotNumber: number;
    confirmAgreement: boolean;
    status: InspectionStatus;
    notes?: string;
    version: number;
    vehicle: Vehicle;
    inspector: IInspector;
    bookingReference: string;
    user: UserState;
    report?:IInspectionReport;
}

