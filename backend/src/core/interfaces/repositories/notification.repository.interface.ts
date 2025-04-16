import { Types } from "mongoose";
import { INotificationDocument } from "../../../models/notification.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface INotificationRepository extends BaseRepository<INotificationDocument> {
    getNotificationsByRecipient(recipientId: Types.ObjectId, limit?: number, offset?: number): Promise<INotificationDocument[]>;
    markAsRead(notificationId: Types.ObjectId): Promise<INotificationDocument | null>;
    markAllAsRead(recipientId: Types.ObjectId): Promise<void>;
    getUnreadCount(recipientId: Types.ObjectId): Promise<number>;
}