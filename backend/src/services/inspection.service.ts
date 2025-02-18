import mongoose from "mongoose";
import { IInspectionInput, IInspectionDocument } from "../models/inspection.model";
import { WeeklyAvailability } from "../models/inspector.model";
import InspectionRepository from "../repositories/inspection.repository";
import { InspectorService } from "./inspector.service";

class InspectionService {
    private inspectionRepository: InspectionRepository;
    private inspectorService: InspectorService;
    constructor() {
        this.inspectionRepository = new InspectionRepository();
        this.inspectorService = new InspectorService()
    }


    async updateInspection(id: string, updateData: Partial<IInspectionInput>): Promise<IInspectionDocument | null> {
        return await this.inspectionRepository.updateInspection(id, updateData);
    }
    async getInspectionById(id: string): Promise<IInspectionDocument | null> {
        return await this.inspectionRepository.getInspectionById(id);
    }
    async findInspections(userId: string): Promise<IInspectionDocument[]> {
        return await this.inspectionRepository.findUserInspections(userId)
    }
    async findInspectionsByInspector(inspectorId: string): Promise<IInspectionDocument[]> {
        return await this.inspectionRepository.findInspectorInspections(inspectorId)
    }
    async checkSlotAvaliability(inspectorId: string, date: Date, slotNumber: number): Promise<boolean> {
        return await this.inspectionRepository.checkSlotAvailability(inspectorId, date, slotNumber);
    }
    async getAvailableSlots(inspectorId: string, date: Date): Promise<number[]> {
        const inspector = await this.inspectorService.getInspectorDetails(inspectorId);
        if (!inspector) throw new Error('Inspector not found');
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof WeeklyAvailability;
        const dayAvailability = inspector.availableSlots[dayOfWeek];
        if (!dayAvailability.enabled) throw new Error('Inspector is not available on this day');
        return await this.inspectionRepository.getAvailableSlots(inspectorId, date, dayAvailability);
    }
    async createInspection(bookingData: Partial<IInspectionInput>): Promise<IInspectionDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (!bookingData.user || !bookingData.inspector || !bookingData.date || !bookingData.slotNumber) {
                throw new Error('Missing required booking data');
            }

            const isAvailable = await this.checkSlotAvaliability(
                bookingData.inspector!.toString(),
                bookingData.date!,
                bookingData.slotNumber!
            );
            if (!isAvailable) {
                throw new Error('Slot is no longer available');
            }
            const bookingReference = await this.generateBookingReference();
            if (!bookingData.user) {
                throw new Error('User is required for booking');
            }

            const inspector = await this.inspectorService.getInspectorDetails(bookingData.inspector!.toString());

            if (!inspector) {
                throw new Error('Inspector not found');
            }

            const booking = await this.inspectionRepository.createInspection({ ...bookingData, bookingReference, version: 0, user: bookingData.user! });
            const validDate = this.validateDate(bookingData.date);
            const dayOfWeek = validDate.toLocaleDateString('en-US', { weekday: 'long' });

            const dayAvailability = inspector.availableSlots[dayOfWeek as keyof WeeklyAvailability];
            if (!dayAvailability.enabled) {
                throw new Error('Inspector is not available on this day');
            }

            await this.inspectorService.bookingHandler(bookingData.inspector!.toString(), bookingData.user!.toString(), bookingData.date!);

            await session.commitTransaction();
            return booking;

        } catch (error) {
            await session.abortTransaction();
            throw error
        } finally {
            session.endSession();
        }
    }

    async cancelInspection(inspectionId: string): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const inspection = await this.inspectionRepository.getInspectionById(inspectionId);
            if (!inspection) {
                throw new Error('Inspection not found');
            }
            await this.inspectorService.unBookingHandler(inspection.inspector.toString(), inspection.user.toString(), inspection.date);
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    private async isReplicaSet(): Promise<boolean> {
        try {
            if (!mongoose.connection.db) {
                throw new Error('Database connection is not established');
            }
            const status = await mongoose.connection.db.admin().replSetGetStatus();
            return !!status;
        } catch (e) {
            return false;
        }
    }

    private validateDate(date: any): Date {
        if (!date) {
            throw new Error('Date is required');
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date format');
        }

        return parsedDate;
    }
    private async generateBookingReference(): Promise<string> {
        const prefix = 'INS';
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${prefix}-${timestamp}-${random}`.toUpperCase();
    }
}


export default new InspectionService();