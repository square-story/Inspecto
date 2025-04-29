export interface INotification {
    _id: string;
    type: string;
    title: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
}