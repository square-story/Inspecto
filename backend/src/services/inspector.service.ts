import { IInspector, InspectorStatus } from "../models/inspector.model";
import { InspectorRepository } from "../repositories/inspector.repository";
import { EmailService } from "./email.service";
import bcrypt from 'bcrypt';

export type ChangePasswordResponse = {
    status: boolean;
    message: string;
};

export class InspectorService {
    private inspectorRepository: InspectorRepository;
    constructor() {
        this.inspectorRepository = new InspectorRepository()
    }
    async getInspectorDetails(inspectorId: string) {
        return await this.inspectorRepository.findInspectorById(inspectorId)
    }
    async completeInspectorProfile(userId: string, data: Partial<IInspector>) {
        const response = await this.inspectorRepository.updateInspector(userId, data)
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
            const updatedInspector = await this.inspectorRepository.updateInspector(inspectorId, updates)
            if (updatedInspector) {
                // Send approval email
                await EmailService.sendApprovalEmail(
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
                await EmailService.sendDenialEmail(
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
            const currentInspector = await this.inspectorRepository.findInspectorById(inspectorId);
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
    async updateDetails(userId: string, data: Partial<IInspector>) {
        return await this.inspectorRepository.updateInspector(userId, data)
    }
    async changePassword(currentPassword: string, newPassword: string, inspectorId: string): Promise<ChangePasswordResponse> {
        try {
            const isValid = await this.inspectorRepository.findInspectorById(inspectorId)
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
}