import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { NotificationService } from "../services/notification.service";
import { Request, Response } from "express";
import { ServiceError } from "../core/errors/service.error";
import { INotificationController } from "../core/interfaces/controllers/notification.controller.interface";
import { HTTP_STATUS } from "../constants/http/status-codes";
import { RESPONSE_MESSAGES } from "../constants/http/response-messages";

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
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND
                })
                return;
            }

            const notifications = await this._notificationService.getNotifications(userId, limit, offset);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    };
    getUnreadNotificationsCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND
                })
                return;
            }

            const count = await this._notificationService.getUnreadCount(userId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: count
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
    markAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            const notificationId = req.params.notificationId
            if (!userId) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND
                })
                return;
            }
            if (!notificationId) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.NOTIFICATION_NOT_FOUND
                })
                return;
            }
            await this._notificationService.markAsRead(userId, notificationId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.SUCCESS.MARKED_AS_READ
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }

    markAllAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            if (!userId) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.USER_NOT_FOUND
                })
                return;
            }
            await this._notificationService.markAllAsRead(userId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'All notifications marked as read'
            })
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                    field: error.field
                });
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: RESPONSE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
                });
            }
        }
    }
}