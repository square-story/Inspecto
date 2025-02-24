import mongoose, { Types } from "mongoose";
import { IInspector, InspectorStatus } from "../models/inspector.model";
import { InspectorRepository } from "../repositories/inspector.repository";
import { EmailService } from "./email.service";
import bcrypt from 'bcrypt';
import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { IInspectionService } from "../core/interfaces/services/inspection.service.interface";
import { TYPES } from "../di/types";
import { InspectionRepository } from "../repositories/inspection.repository";
import { IInspectionInput, IInspectionDocument } from "../models/inspection.model";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";

export type ChangePasswordResponse = {
    status: boolean;
    message: string;
};

@injectable()
export class InspectorService extends BaseService<IInspector> implements IInspectorService {
    constructor(
        @inject(TYPES.InspectorRepository) private inspectorRepository: InspectorRepository,
        @inject(TYPES.EmailService) private emailService: EmailService,
    ) {
        super(inspectorRepository);
    }
    async findInspectorById(id: string): Promise<IInspector | null> {
        return await this.findById(new Types.ObjectId(id))
    }
    async updateInspector(id: string, updates: Partial<IInspector>): Promise<IInspector | null> {
        return await this.update(new Types.ObjectId(id), updates)
    }
    async getAllInspectors(): Promise<IInspector[]> {
        return await this.repository.findAll()
    }

    async getInspectorDetails(inspectorId: string) {
        return await this.repository.findById(new Types.ObjectId(inspectorId))
    }

    async completeInspectorProfile(userId: string, data: Partial<IInspector>) {
        const response = await this.repository.findByIdAndUpdate(new Types.ObjectId(userId), data)
        if (response) {
            return await this.inspectorRepository.updateInspectorProfileCompletion(userId)
        }
    }

    async approveInspector(inspectorId: string) {
        try {
            const updates = {
                isListed: true,
                status: InspectorStatus.APPROVED,
                denialReason: '',
                approvedAt: new Date(),
            };
            const updatedInspector = await this.repository.findByIdAndUpdate(new Types.ObjectId(inspectorId), updates)
            if (updatedInspector) {
                // Send approval email
                await this.emailService.sendApprovalEmail(
                    updatedInspector.email,
                    updatedInspector.firstName
                );
            }
            return updatedInspector;
        } catch (error) {
            console.error('Error in approveInspector:', error);
            throw error;
        }
    }


    async denyInspector(inspectorId: string, reason: string) {
        try {
            const updates = {
                isListed: false,
                status: InspectorStatus.DENIED,
                isCompleted: false,
                deniedAt: new Date(),
                denialReason: reason
            };
            const updatedInspector = await this.inspectorRepository.updateInspector(inspectorId, updates);

            if (updatedInspector) {
                // Send denial email
                await this.emailService.sendDenialEmail(
                    updatedInspector.email,
                    updatedInspector.firstName,
                    reason
                );
            }

            return updatedInspector;
        } catch (error) {
            console.error('Error in denyInspector:', error);
            throw error;
        }
    }


    async BlockHandler(inspectorId: string) {
        try {
            const currentInspector = await this.inspectorRepository.findById(new Types.ObjectId(inspectorId));
            if (!currentInspector) {
                throw new Error('Inspector not found');
            }
            const updates = {
                status: currentInspector.status === InspectorStatus.BLOCKED ? InspectorStatus.APPROVED : InspectorStatus.BLOCKED,
            };
            await this.inspectorRepository.updateInspector(inspectorId, updates);
            // if (updatedInspector) {
            //     if (updates.status === InspectorStatus.BLOCKED) {
            //         await EmailService.sendBlockNotification(updatedInspector.email, updatedInspector.firstName);
            //     } else {
            //         await EmailService.sendUnblockNotification(updatedInspector.email, updatedInspector.firstName);
            //     }
            // }
            return updates.status === InspectorStatus.APPROVED ? "UnBlocked" : "Blocked"
        } catch (error) {
            console.error('Error in denyInspector:', error);
            throw error;
        }
    }


    async changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<ChangePasswordResponse> {
        try {
            const isValid = await this.inspectorRepository.findById(new Types.ObjectId(inspectorId))
            if (!isValid) {
                return {
                    status: false,
                    message: 'The user is not available.',
                };
            }

            const isMatch = await bcrypt.compare(currentPassword, isValid.password as string);

            if (!isMatch) {
                return {
                    status: false,
                    message: 'The current password is incorrect.',
                };
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const response = await this.inspectorRepository.updateInspector(inspectorId, {
                password: hashedNewPassword,
            });

            if (response) {
                return {
                    status: true,
                    message: 'The password has been changed successfully.',
                };
            } else {
                return {
                    status: false,
                    message: 'Failed to update the password.',
                };
            }
        } catch (error) {
            console.error('Error in changePassword:', error);
            throw error;
        }
    }
    async getNearbyInspectors(latitude: string, longitude: string) {
        return await this.inspectorRepository.getNearbyInspectors(latitude, longitude)
    }

    async bookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession) {
        return await this.inspectorRepository.bookingHandler(inspectorId, userId, date,)
    }
    async unBookingHandler(inspectorId: string, userId: string, date: Date, session?: mongoose.mongo.ClientSession) {
        return await this.inspectorRepository.unbookingHandler(inspectorId, userId, date)
    }
}