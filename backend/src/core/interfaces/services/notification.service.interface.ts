import { INotificationDocument, NotificationType } from "../../../models/notification.model";

export interface INotificationService {
    getNotifications(userId: string, limit?: number, offset?: number): Promise<INotificationDocument[]>
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(userId: string, notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>
    createAndSendNotification(recipientId: string, recipientModel: "User" | "Inspector" | "Admin", type: NotificationType, title: string, message: string, data?: Record<string, unknown>): Promise<void>;
}