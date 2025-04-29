import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { NotificationService } from "../services/notification.service";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";
import { INotificationController } from "../core/interfaces/controllers/notification.controller.interface";

injectable()
export class NotificationController implements INotificationController {
    constructor(
        @inject(TYPES.NotificationService) private _notificationService: NotificationService
    ) { }

    getNotifications = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;

            if (!userId) {
                res.status(404).json({
                    success: false,
                    message: "user not found"
                })
                return;
            }

            const notifications = await this._notificationService.getNotifications(userId, limit, offset);

            res.status(200).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    };
    getUnreadNotificationsCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                res.status(404).json({
                    success: false,
                    message: "user not found"
                })
                return;
            }

            const count = await this._notificationService.getUnreadCount(userId)
            res.status(200).json({
                success: true,
                data: count
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
    markAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const notificationId = req.params.notificationId
            if (!userId) {
                res.status(404).json({
                    success: false,
                    message: "user not found"
                })
                return;
            }
            if (!notificationId) {
                res.status(404).json({
                    success: false,
                    message: "notification not found"
                })
                return;
            }
            await this._notificationService.markAsRead(userId, notificationId)
            res.status(200).json({
                success: true,
                message: 'marked as read'
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    markAllAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                res.status(404).json({
                    success: false,
                    message: "user not found"
                })
                return;
            }
            await this._notificationService.markAllAsRead(userId)
            res.status(200).json({
                success: true,
                message: 'All notifications marked as read'
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }
}