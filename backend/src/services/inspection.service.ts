import mongoose from "mongoose";
import { IInspectionInput, IInspectionDocument, InspectionStatus } from "../models/inspection.model";
import { WeeklyAvailability } from "../models/inspector.model";
import { BaseService } from "../core/abstracts/base.service";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { InspectionRepository } from "../repositories/inspection.repository";
import { InspectorRepository } from "../repositories/inspector.repository";
import { Types } from "mongoose";


@injectable()
export class InspectionService extends BaseService<IInspectionDocument> implements IInspectionService {
    constructor(
        @inject(TYPES.InspectionRepository) private inspectionRepository: InspectionRepository,
        @inject(TYPES.InspectorRepository) private inspectorRepository: InspectorRepository,
    ) {
        super(inspectionRepository)
    }
    async getUserInspections(userId: string): Promise<IInspectionDocument[]> {
        return await this.inspectionRepository.find({ user: userId })
    }
    async getInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
        return await this.inspectionRepository.find({ inspector: inspectorId })
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
        const inspector = await this.inspectorRepository.findById(new Types.ObjectId(inspectorId));
        if (!inspector) throw new Error('Inspector not found');
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof WeeklyAvailability;
        const dayAvailability = inspector.availableSlots[dayOfWeek];
        if (!dayAvailability.enabled) throw new Error('Inspector is not available on this day');
        return await this.inspectionRepository.getAvailableSlots(inspectorId, date, dayAvailability);
    }

    async createInspection(data: IInspectionInput): Promise<IInspectionDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (!data.user || !data.inspector || !data.date || !data.slotNumber) {
                throw new Error('Missing required booking data');
            }
            const existingBooking = await this.inspectionRepository.existingInspection({
                date: data.date,
                inspector: data.inspector.toString(),
                slotNumber: data.slotNumber,
            });

            console.log('the exisiing booking:', existingBooking)

            // If there's an existing booking and it's not cancelled, throw error
            if (existingBooking && existingBooking.status !== InspectionStatus.CANCELLED) {
                throw new Error('Slot is no longer available');
            }

            const isAvailable = await this.checkSlotAvaliability(
                data.inspector!.toString(),
                data.date!,
                data.slotNumber!
            );
            if (!isAvailable) {
                throw new Error('Slot is no longer available');
            }
            const bookingReference = await this.generateBookingReference();
            if (!data.user) {
                throw new Error('User is required for booking');
            }

            const inspector = await this.inspectorRepository.findById(new Types.ObjectId(data.inspector!.toString()));

            if (!inspector) {
                throw new Error('Inspector not found');
            }

            const validDate = this.validateDate(data.date);
            const dayOfWeek = validDate.toLocaleDateString('en-US', { weekday: 'long' });

            const dayAvailability = inspector.availableSlots[dayOfWeek as keyof WeeklyAvailability];
            if (!dayAvailability.enabled) {
                throw new Error('Inspector is not available on this day');
            }

            let booking;
            if (existingBooking) {
                booking = await this.inspectionRepository.updateInspection(
                    existingBooking.id,
                    {
                        ...data,
                        bookingReference,
                        status: InspectionStatus.PENDING,
                        version: existingBooking.version + 1
                    },
                );
            } else {
                // Create new booking if no existing one found
                booking = await this.inspectionRepository.createInspection({
                    ...data,
                    bookingReference,
                    version: 0,
                    status: InspectionStatus.PENDING,
                    user: data.user
                });
            }

            const response = await this.inspectorRepository.bookingHandler(
                data.inspector.toString(),
                data.user.toString(),
                data.date
            );
            await session.commitTransaction();
            if (!booking) {
                throw new Error('Failed to create or update booking');
            }
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
            await this.inspectorRepository.unbookingHandler(inspection.inspector.toString(), inspection.user.toString(), inspection.date);
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
