import app from "./app";
import appConfig from "./config/app.config";
import { connectToDatabase } from "./config/db.config";
import mongoose from "mongoose";
import { container } from "./di/container";
import { SocketService } from "./services/socket.service";
import { TYPES } from "./di/types";

async function startServer() {
    try {
        // Connect to Database
        await connectToDatabase();
        console.log('Database connected successfully');

        const server = app.listen(appConfig.port, () => {
            console.log(`Server is running on port ${appConfig.port}`);
        });

        const socketService = container.get<SocketService>(TYPES.SocketService);
        socketService.initialize(server)

        // Graceful shutdown handlers
        const shutdown = async () => {
            console.log('Starting graceful shutdown...');

            // Close HTTP Server
            server.close(() => {
                console.log('HTTP server closed');
            });

            // Close Database connection
            try {
                await mongoose.connection.close();
                console.log('Database connection closed');
                process.exit(0);
            } catch (err) {
                console.error('Error during database disconnect:', err);
                process.exit(1);
            }
        };

        // Handle different shutdown signals
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            shutdown();
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();