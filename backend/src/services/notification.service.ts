import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { INotificationDocument, NotificationType } from "../models/notification.model";
import { TYPES } from "../di/types";
import { SocketService } from "./socket.service";
import { NotificationRepository } from "../repositories/notification.repository";
import { Types } from "mongoose";
import { INotificationService } from "../core/interfaces/services/notification.service.interface";

@injectable()
export class NotificationService extends BaseService<INotificationDocument> implements INotificationService {
    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository: NotificationRepository,
        @inject(TYPES.SocketService) private _socketService: SocketService
    ) {
        super(_notificationRepository)
    }

    async createAndSendNotification(
        recipientId: string,
        recipientModel: 'User' | 'Inspector' | 'Admin',
        type: NotificationType,
        title: string,
        message: string,
        data?: Record<string, unknown>
    ): Promise<void> {
        const notification = await this._notificationRepository.create(
            {
                recipient: new Types.ObjectId(recipientId),
                recipientModel,
                type,
                title,
                message,
                data
            }
        )

        await this._socketService.sendNotificationToUser(recipientId, {
            id: notification._id?.toString(),
            type,
            title,
            message,
            data,
            createdAt: notification.createdAt
        });
    }

    async getNotifications(userId: string, limit: number = 20, offset: number = 0) {
        return await this._notificationRepository.getNotificationsByRecipient(
            new Types.ObjectId(userId),
            limit,
            offset
        );
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await this._notificationRepository.getUnreadCount(new Types.ObjectId(userId));
    }

    async markAsRead(userId: string, notificationId: string): Promise<void> {
        await this._notificationRepository.markAsRead(new Types.ObjectId(notificationId));
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this._notificationRepository.markAllAsRead(new Types.ObjectId(userId));
    }
}