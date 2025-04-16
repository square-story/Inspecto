/* eslint-disable @typescript-eslint/no-unused-vars */
import { Socket, Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { injectable } from 'inversify';
import redisClient from '../config/redis.config';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app.config';

@injectable()
export class SocketService {
    private io: SocketIOServer | null = null;
    private userSocketMap: Map<string, string> = new Map(); // userId -> socketId

    initialize(server: Server): void {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        // Middleware to authenticate socket connections using JWT
        this.io.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token;

                console.log('Socket authentication token:', token);
                if (!token) {
                    return next(new Error('Authentication token missing'));
                }

                // Verify the token and extract userId
                const decoded = jwt.verify(token, appConfig.accessToken);

                console.log('Decoded token:', decoded);
                if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
                    return next(new Error('Invalid token'));
                }

                // Attach userId to socket for later use
                socket.data.userId = decoded.userId;
                next();
            } catch (error) {
                next(new Error('Authentication failed'));
            }
        });

        this.io.on('connection', (socket) => {
            console.log('New client connected', socket.id);

            // Get userId from socket data (set in middleware)
            const userId = socket.data.userId;

            if (userId) {
                this.userSocketMap.set(userId, socket.id);
                console.log(`User ${userId} authenticated with socket ${socket.id}`);

                // Join user to their own room for targeted notifications
                socket.join(`user:${userId}`);

                // Load any pending notifications from Redis
                this.loadPendingNotifications(socket, userId);
            }

            socket.on('disconnect', () => {
                // Remove user from socket map
                if (userId) {
                    this.userSocketMap.delete(userId);
                    console.log(`User ${userId} disconnected`);
                }
            });
        });
    }

    // Load pending notifications for a user
    private async loadPendingNotifications(socket: Socket, userId: string): Promise<void> {
        try {
            const pendingNotifications = await this.getPendingNotifications(userId);
            if (pendingNotifications.length > 0) {
                socket.emit('pending-notifications', pendingNotifications);
                await this.clearPendingNotifications(userId);
            }
        } catch (error) {
            console.error('Error loading pending notifications:', error);
        }
    }

    // Send notification to a specific user
    async sendNotificationToUser(userId: string, notification: any): Promise<void> {
        const socketId = this.userSocketMap.get(userId);

        if (this.io && socketId) {
            // User is online, send directly
            this.io.to(`user:${userId}`).emit('notification', notification);
        } else {
            // User is offline, store in Redis for later delivery
            await this.storePendingNotification(userId, notification);
        }
    }

    // Send notification to multiple users
    async sendNotificationToUsers(userIds: string[], notification: any): Promise<void> {
        for (const userId of userIds) {
            await this.sendNotificationToUser(userId, notification);
        }
    }

    // Send notification to all connected clients
    sendNotificationToAll(notification: any): void {
        if (this.io) {
            this.io.emit('notification', notification);
        }
    }

    // Store notification in Redis for offline users
    private async storePendingNotification(userId: string, notification: any): Promise<void> {
        const key = `notifications:${userId}`;
        await redisClient.lPush(key, JSON.stringify(notification));
        // Set expiration for 30 days
        await redisClient.expire(key, 60 * 60 * 24 * 30);
    }

    // Get pending notifications for a user
    private async getPendingNotifications(userId: string): Promise<any[]> {
        const key = `notifications:${userId}`;
        const notifications = await redisClient.lRange(key, 0, -1);
        return notifications.map(n => JSON.parse(n));
    }

    // Clear pending notifications after delivery
    private async clearPendingNotifications(userId: string): Promise<void> {
        const key = `notifications:${userId}`;
        await redisClient.del(key);
    }
}