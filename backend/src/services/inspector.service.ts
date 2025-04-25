import { Types } from "mongoose";
import { IInspector, InspectorStatus } from "../models/inspector.model";
import bcrypt from 'bcrypt';
import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { TYPES } from "../di/types";
import { IInspectorService } from "../core/interfaces/services/inspector.service.interface";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";
import { IEmailService } from "../core/interfaces/services/email.service.interface";
import { NotificationService } from "./notification.service";
import { NotificationType } from "../models/notification.model";
import appConfig from "../config/app.config";

export type ChangePasswordResponse = {
    status: boolean;
    message: string;
};

@injectable()
export class InspectorService extends BaseService<IInspector> implements IInspectorService {
    constructor(
        @inject(TYPES.InspectorRepository) private _inspectorRepository: IInspectorRepository,
        @inject(TYPES.EmailService) private _emailService: IEmailService,
        @inject(TYPES.NotificationService) private _notificationService: NotificationService,
    ) {
        super(_inspectorRepository);
    }

    async completeInspectorProfile(userId: string, data: Partial<IInspector>) {
        const response = await this.repository.findByIdAndUpdate(new Types.ObjectId(userId), data)

        if (response) {
            await this._notificationService.createAndSendNotification(
                appConfig.adminId,
                "Admin",
                NotificationType.SYSTEM,
                "Inspector Profile Completed",
                `${response?.firstName} ${response?.lastName} has completed their profile.`,
                {
                    userId
                }
            )
            return await this._inspectorRepository.updateInspectorProfileCompletion(userId)
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
                await this._emailService.sendApprovalEmail(
                    updatedInspector.email,
                    updatedInspector.firstName
                );

                await this._notificationService.createAndSendNotification(
                    inspectorId,
                    "Inspector",
                    NotificationType.INSPECTOR_APPROVED,
                    "Inspector Approved",
                    "Your inspector account has been approved.",
                    {
                        inspectorId
                    }
                )
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
            const updatedInspector = await this._inspectorRepository.update(new Types.ObjectId(inspectorId), updates);

            if (updatedInspector) {
                // Send denial email
                await this._emailService.sendDenialEmail(
                    updatedInspector.email,
                    updatedInspector.firstName,
                    reason
                );
                await this._notificationService.createAndSendNotification(
                    updatedInspector._id.toString(),
                    "Inspector",
                    NotificationType.SYSTEM,
                    "Inspector Profile Completed",
                    `${updatedInspector?.firstName} ${updatedInspector?.lastName} has Denied their profile.`,
                )
            }

            return updatedInspector;
        } catch (error) {
            console.error('Error in denyInspector:', error);
            throw error;
        }
    }


    async BlockHandler(inspectorId: string) {
        try {
            const currentInspector = await this._inspectorRepository.findById(new Types.ObjectId(inspectorId));
            if (!currentInspector) {
                throw new Error('Inspector not found');
            }
            const updates = {
                status: currentInspector.status === InspectorStatus.BLOCKED ? InspectorStatus.APPROVED : InspectorStatus.BLOCKED,
            };
            await this._inspectorRepository.update(new Types.ObjectId(inspectorId), updates);
            // if (updatedInspector) {
            //     if (updates.status === InspectorStatus.BLOCKED) {
            //         await EmailService.sendBlockNotification(updatedInspector.email, updatedInspector.firstName);
            //     } else {
            //         await EmailService.sendUnblockNotification(updatedInspector.email, updatedInspector.firstName);
            //     }
            // }

            await this._notificationService.createAndSendNotification(
                inspectorId,
                "Inspector",
                NotificationType.SYSTEM,
                "Inspector Blocked",
                `Your account has been ${updates.status === InspectorStatus.BLOCKED ? 'blocked' : 'unblocked'}.`,
            )

            return updates.status === InspectorStatus.APPROVED ? "UnBlocked" : "Blocked"
        } catch (error) {
            console.error('Error in denyInspector:', error);
            throw error;
        }
    }


    async changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<ChangePasswordResponse> {
        try {
            const isValid = await this._inspectorRepository.findById(new Types.ObjectId(inspectorId))
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
            const response = await this._inspectorRepository.update(new Types.ObjectId(inspectorId), {
                password: hashedNewPassword,
            });

            if (response) {

                await this._notificationService.createAndSendNotification(
                    inspectorId,
                    "Inspector",
                    NotificationType.SYSTEM,
                    "Password Changed",
                    "Your password has been changed successfully.",
                    {
                        inspectorId
                    }
                )
                return {
                    status: true,
                    message: 'Password updated successfully.',
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
        return await this._inspectorRepository.getNearbyInspectors(latitude, longitude)
    }

    async bookingHandler(inspectorId: string, userId: string, date: Date) {
        return await this._inspectorRepository.bookingHandler(inspectorId, userId, date,)
    }
    async unBookingHandler(inspectorId: string, userId: string, date: Date) {
        return await this._inspectorRepository.unbookingHandler(inspectorId, userId, date)
    }
}