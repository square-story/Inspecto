import mongoose, { Document, Schema } from "mongoose";

export enum NotificationType {
    INSPECTION_CREATED = 'INSPECTION_CREATED',
    INSPECTION_UPDATED = 'INSPECTION_UPDATED',
    INSPECTION_COMPLETED = 'INSPECTION_COMPLETED',
    INSPECTOR_APPROVED = 'INSPECTOR_APPROVED',
    INSPECTOR_DENIED = 'INSPECTOR_DENIED',
    PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    SYSTEM = 'SYSTEM'
}

export interface INotification{
    recipient: mongoose.Types.ObjectId;
    recipientModel: string;
    type: NotificationType;
    title: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: Date;
}

export interface INotificationDocument extends INotification, Document {}

const notificationSchema = new Schema<INotificationDocument>({
    recipient:{
        type: Schema.Types.ObjectId,
        required:true,
        refPath:'recipientModel'
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['User', 'Inspector', 'Admin']
    },
    type: {
        type: String,
        enum: Object.values(NotificationType),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true
})

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);