import { Router } from "express";
import { container } from "../di/container";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TYPES } from "../di/types";
import { INotificationController } from "../core/interfaces/controllers/notification.controller.interface";


const notificationRouter = Router();
const notificationController = container.get<INotificationController>(TYPES.NotificationController)
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware)
const authenticateToken = authMiddleware.authenticateToken

notificationRouter.get('/', authenticateToken, notificationController.getNotifications)

notificationRouter.get('/unread-count', authenticateToken, notificationController.getUnreadNotificationsCount)

notificationRouter.patch('/:notificationId/read', authenticateToken, notificationController.markAsRead)

notificationRouter.patch('/read-all', authenticateToken, notificationController.markAllAsRead)

export default notificationRouter;