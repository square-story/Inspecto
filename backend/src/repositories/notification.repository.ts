import { injectable } from "inversify";
import { INotificationDocument, Notification } from "../models/notification.model";
import { Types } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { INotificationRepository } from "../core/interfaces/repositories/notification.repository.interface";

@injectable()
export class NotificationRepository extends BaseRepository<INotificationDocument> implements INotificationRepository {

    constructor() {
        super(Notification)
    }
    async getNotificationsByRecipient(
        recipientId: Types.ObjectId,
        limit: number = 20,
        offset: number = 0,
    ): Promise<INotificationDocument[]> {
        return await this.model.find({ recipient: recipientId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .exec();
    }

    async markAsRead(notificationId: Types.ObjectId): Promise<INotificationDocument | null> {
        return await this.model.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        ).exec();
    }

    async markAllAsRead(recipientId: Types.ObjectId): Promise<void> {
        await this.model.updateMany(
            { recipient: recipientId, isRead: false },
            { isRead: true }
        ).exec();
    }

    async getUnreadCount(recipientId: Types.ObjectId): Promise<number> {
        return await this.model.find({
            recipient: recipientId,
            isRead: false
        }).countDocuments()
    }
}