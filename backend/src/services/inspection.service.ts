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
import { ServiceError } from "../core/errors/service.error";

@injectable()
export class InspectionService extends BaseService<IInspectionDocument> implements IInspectionService {
    constructor(
        @inject(TYPES.InspectionRepository) private inspectionRepository: InspectionRepository,
        @inject(TYPES.InspectorRepository) private inspectorRepository: InspectorRepository,
    ) {
        super(inspectionRepository);
    }

    async getUserInspections(userId: string): Promise<IInspectionDocument[]> {
        try {
            return await this.inspectionRepository.find({ user: userId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting user inspections: ${error.message}`);
            }
            throw error;
        }
    }

    async getInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
        try {
            return await this.inspectionRepository.find({ inspector: inspectorId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspector inspections: ${error.message}`);
            }
            throw error;
        }
    }

    async updateInspection(id: string, updateData: Partial<IInspectionInput>): Promise<IInspectionDocument | null> {
        try {
            return await this.inspectionRepository.update(new Types.ObjectId(id), updateData);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error updating inspection: ${error.message}`);
            }
            throw error;
        }
    }

    async getInspectionById(id: string): Promise<IInspectionDocument | null> {
        try {
            return await this.inspectionRepository.findById(new Types.ObjectId(id));
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspection by ID: ${error.message}`);
            }
            throw error;
        }
    }

    async findInspections(userId: string): Promise<IInspectionDocument[]> {
        try {
            return await this.inspectionRepository.findUserInspections(userId);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding inspections: ${error.message}`);
            }
            throw error;
        }
    }

    async findInspectionsByInspector(inspectorId: string): Promise<IInspectionDocument[]> {
        try {
            return await this.inspectionRepository.findInspectorInspections(inspectorId);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding inspections by inspector: ${error.message}`);
            }
            throw error;
        }
    }

    async checkSlotAvaliability(inspectorId: string, date: Date, slotNumber: number): Promise<boolean> {
        try {
            return await this.inspectionRepository.checkSlotAvailability(inspectorId, date, slotNumber);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error checking slot availability: ${error.message}`);
            }
            throw error;
        }
    }

    async getAvailableSlots(inspectorId: string, date: Date): Promise<number[]> {
        try {
            const inspector = await this.inspectorRepository.findById(new Types.ObjectId(inspectorId));
            if (!inspector) throw new ServiceError('Inspector not found');
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof WeeklyAvailability;
            const dayAvailability = inspector.availableSlots[dayOfWeek];
            if (!dayAvailability.enabled) throw new ServiceError('Inspector is not available on this day');
            return await this.inspectionRepository.getAvailableSlots(inspectorId, date, dayAvailability);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting available slots: ${error.message}`);
            }
            throw error;
        }
    }

    async createInspection(data: IInspectionInput): Promise<IInspectionDocument> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (!data.user || !data.inspector || !data.date || !data.slotNumber) {
                throw new ServiceError('Missing required booking data');
            }
            const existingBooking = await this.inspectionRepository.existingInspection({
                date: data.date,
                inspector: data.inspector.toString(),
                slotNumber: data.slotNumber,
            });

            // If there's an existing booking and it's not cancelled, throw error
            if (existingBooking && existingBooking.status !== InspectionStatus.CANCELLED) {
                throw new ServiceError('Slot is no longer available');
            }

            const isAvailable = await this.checkSlotAvaliability(
                data.inspector!.toString(),
                data.date!,
                data.slotNumber!
            );
            if (!isAvailable) {
                throw new ServiceError('Slot is no longer available');
            }
            const bookingReference = await this.generateBookingReference();
            if (!data.user) {
                throw new ServiceError('User is required for booking');
            }

            const inspector = await this.inspectorRepository.findById(new Types.ObjectId(data.inspector!.toString()));

            if (!inspector) {
                throw new ServiceError('Inspector not found');
            }

            const validDate = this.validateDate(data.date);
            const dayOfWeek = validDate.toLocaleDateString('en-US', { weekday: 'long' });

            const dayAvailability = inspector.availableSlots[dayOfWeek as keyof WeeklyAvailability];
            if (!dayAvailability.enabled) {
                throw new ServiceError('Inspector is not available on this day');
            }

            let booking;
            if (existingBooking) {
                booking = await this.inspectionRepository.update(
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
                booking = await this.inspectionRepository.create({
                    ...data,
                    bookingReference,
                    version: 0,
                    status: InspectionStatus.PENDING,
                    user: data.user
                });
            }

            await this.inspectorRepository.bookingHandler(
                data.inspector.toString(),
                data.user.toString(),
                data.date
            );
            await session.commitTransaction();
            if (!booking) {
                throw new ServiceError('Failed to create or update booking');
            }
            return booking;

        } catch (error) {
            await session.abortTransaction();
            if (error instanceof Error) {
                throw new ServiceError(`Error creating inspection: ${error.message}`);
            }
            throw error;
        } finally {
            session.endSession();
        }
    }

    async cancelInspection(inspectionId: string): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const inspection = await this.inspectionRepository.findById(new Types.ObjectId(inspectionId));
            if (!inspection) {
                throw new ServiceError('Inspection not found');
            }
            await this.inspectorRepository.unbookingHandler(inspection.inspector.toString(), inspection.user.toString(), inspection.date);
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof Error) {
                throw new ServiceError(`Error cancelling inspection: ${error.message}`);
            }
            throw error;
        } finally {
            session.endSession();
        }
    }

    private validateDate(date: Date): Date {
        if (!date) {
            throw new ServiceError('Date is required');
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            throw new ServiceError('Invalid date format');
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
