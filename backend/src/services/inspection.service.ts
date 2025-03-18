import mongoose, { ClientSession } from "mongoose";
import { IInspectionInput, IInspectionDocument, InspectionStatus } from "../models/inspection.model";
import { WeeklyAvailability } from "../models/inspector.model";
import { BaseService } from "../core/abstracts/base.service";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { Types } from "mongoose";
import { ServiceError } from "../core/errors/service.error";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { IInspectionStats } from "../core/types/inspection.stats.type";
import { IPaymentRepository } from "../core/interfaces/repositories/payment.repository.interface";

@injectable()
export class InspectionService extends BaseService<IInspectionDocument> implements IInspectionService {
    constructor(
        @inject(TYPES.InspectionRepository) private _inspectionRepository: IInspectionRepository,
        @inject(TYPES.InspectorRepository) private _inspectorRepository: IInspectorRepository,
        @inject(TYPES.PaymentRepository) private _paymentRepository: IPaymentRepository,
    ) {
        super(_inspectionRepository);
    }
    async getStatsAboutInspector(inspectorId: string): Promise<IInspectionStats> {
        try {
            const { completedInspections, pendingInspections, totalInspections } = await this._inspectionRepository.getInspectionStats(inspectorId);
            const { thisMonthEarnings, totalEarnings } = await this._paymentRepository.getInspectionStats(inspectorId)

            const completionRate = totalInspections > 0
                ? (completedInspections / totalInspections) * 100
                : 0;

            return {
                totalEarnings,
                completionRate: Math.round(completionRate),
                pendingInspections,
                thisMonthEarnings,
                totalInspections
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting user inspections: ${error.message}`);
            }
            throw error;
        }
    }


    async getUserInspections(userId: string): Promise<IInspectionDocument[]> {
        try {
            return await this._inspectionRepository.find({ user: userId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting user inspections: ${error.message}`);
            }
            throw error;
        }
    }

    async getInspectorInspections(inspectorId: string): Promise<IInspectionDocument[]> {
        try {
            return await this._inspectionRepository.find({ inspector: inspectorId });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspector inspections: ${error.message}`);
            }
            throw error;
        }
    }

    async updateInspection(id: string, updateData: Partial<IInspectionInput>): Promise<IInspectionDocument | null> {
        try {
            return await this._inspectionRepository.update(new Types.ObjectId(id), updateData);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error updating inspection: ${error.message}`);
            }
            throw error;
        }
    }

    async getInspectionById(id: string): Promise<IInspectionDocument | null> {
        try {
            return await this._inspectionRepository.findById(new Types.ObjectId(id),['vehicle', 'user', 'inspector']);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspection by ID: ${error.message}`);
            }
            throw error;
        }
    }

    async findInspections(userId: string): Promise<IInspectionDocument[]> {
        try {
            return await this._inspectionRepository.findUserInspections(userId);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding inspections: ${error.message}`);
            }
            throw error;
        }
    }

    async findInspectionsByInspector(inspectorId: string): Promise<IInspectionDocument[]> {
        try {
            return await this._inspectionRepository.findInspectorInspections(inspectorId);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding inspections by inspector: ${error.message}`);
            }
            throw error;
        }
    }

    async checkSlotAvaliability(inspectorId: string, date: Date, slotNumber: number, session: ClientSession): Promise<boolean> {
        try {
            return await this._inspectionRepository.checkSlotAvailability(inspectorId, date, slotNumber, session);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error checking slot availability: ${error.message}`);
            }
            throw error;
        }
    }

    async getAvailableSlots(inspectorId: string, date: Date): Promise<number[]> {
        try {
            const inspector = await this._inspectorRepository.findById(new Types.ObjectId(inspectorId));
            if (!inspector) throw new ServiceError('Inspector not found');
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof WeeklyAvailability;
            const dayAvailability = inspector.availableSlots[dayOfWeek];
            if (!dayAvailability.enabled) throw new ServiceError('Inspector is not available on this day');
            return await this._inspectionRepository.getAvailableSlots(inspectorId, date, dayAvailability);
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting available slots: ${error.message}`);
            }
            throw error;
        }
    }

    async createInspection(data: IInspectionInput): Promise<IInspectionDocument> {
        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();
        try {
            if (!data.user || !data.inspector || !data.date || !data.slotNumber) {
                throw new ServiceError('Missing required booking data');
            }

            const existingBooking = await this._inspectionRepository.existingInspection({
                date: data.date,
                inspector: data.inspector.toString(),
                slotNumber: data.slotNumber,
            }, session);

            // If there's an existing booking and it's not cancelled, throw error
            if (existingBooking && existingBooking.status !== InspectionStatus.CANCELLED) {
                throw new ServiceError('Slot is no longer available');
            }

            const isAvailable = await this.checkSlotAvaliability(
                data.inspector!.toString(),
                data.date!,
                data.slotNumber!,
                session
            );

            if (!isAvailable) {
                throw new ServiceError('Slot is no longer available');
            }

            const bookingReference = await this.generateBookingReference();
            if (!data.user) {
                throw new ServiceError('User is required for booking');
            }

            const inspector = await this._inspectorRepository.findInspectorById(data.inspector!.toString(), session);

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
                booking = await this._inspectionRepository.updateInspection(
                    existingBooking.id,
                    {
                        ...data,
                        bookingReference,
                        status: InspectionStatus.PENDING,
                        version: existingBooking.version + 1
                    },
                    session
                );
            } else {
                // Create new booking if no existing one found
                booking = await this._inspectionRepository.createInspection({
                    ...data,
                    bookingReference,
                    version: 0,
                    status: InspectionStatus.PENDING,
                    user: data.user
                }, session);
            }

            await this._inspectorRepository.bookingHandler(
                data.inspector.toString(),
                data.user.toString(),
                data.date,
                session
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
            const inspection = await this._inspectionRepository.findById(new Types.ObjectId(inspectionId));
            if (!inspection) {
                throw new ServiceError('Inspection not found');
            }
            await this._inspectorRepository.unbookingHandler(inspection.inspector.toString(), inspection.user.toString(), inspection.date);
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
