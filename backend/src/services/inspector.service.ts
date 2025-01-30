import { IInspector, InspectorStatus } from "../models/inspector.model";
import { InspectorRepository } from "../repositories/inspector.repository";
import { EmailService } from "./email.service";

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
}