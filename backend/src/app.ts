import "reflect-metadata";
import express, { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import adminRoutes from "./routes/admin.routes";
import userRoutes from './routes/user.routes';
import inspectorRoutes from "./routes/inspector.routes";
import vehiclesRoutes from "./routes/vehicles.routes";
import inspectionRoutes from "./routes/inspection.routes";
import paymentsRoutes from './routes/payment.routes';
import cloudinaryRoutes from './routes/cloudinary.routes';
import reviewRouter from "./routes/review.routes";
import cors from "cors";
import jwt from "jsonwebtoken";
import { errorHandler } from './middlewares/error.middleware';
import { blacklistToken } from "./utils/token.utils";
import { container } from './di/container';
import { TYPES } from './di/types';
import { PaymentStatusChecker } from './utils/checkPaymentStatus';
import { IPaymentService } from './core/interfaces/services/payment.service.interface';
import { developmentLogger, errorLogger } from "./config/logger.config";
import withdrawalRoutes from "./routes/withdrawal.routes";
import walletRoutes from "./routes/wallet.routes";
import notificationRouter from "./routes/notification.routes";

const app = express();

// Regular routes should use JSON parsing
app.use((req, res, next) => {
    if (req.originalUrl === '/payments/webhook') {
        next();
    } else {
        express.json({ limit: '50mb' })(req, res, next);
    }
});

app.use((req, res, next) => {
    if (req.originalUrl === '/payments/webhook') {
        next();
    } else {
        express.urlencoded({ limit: '50mb', extended: true })(req, res, next);
    }
});

app.use(developmentLogger);  // Log successful requests
app.use(errorLogger);
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173", "http://frontend:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.get('/', (req: Request, res: Response) => {
    res.send('server is up and running');
});

app.post('/logout', async (req: Request, res: Response): Promise<void> => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        const refreshToken = req.cookies.refreshToken;

        if (accessToken) {
            const decoded = jwt.decode(accessToken) as jwt.JwtPayload;
            if (decoded.exp) {
                const expirationTime = decoded.exp - Math.floor(Date.now() / 1000);
                await blacklistToken(accessToken, expirationTime);
            }
        }

        if (refreshToken) {
            const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
            if (decoded.exp) {
                const expirationTime = decoded.exp - Math.floor(Date.now() / 1000);
                await blacklistToken(refreshToken, expirationTime);
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to logout', error: (error as Error).message });
    }
});

// Routes
app.use('/admin', adminRoutes);
app.use('/inspector', inspectorRoutes);
app.use('/user', userRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/inspections', inspectionRoutes);
app.use('/payments', paymentsRoutes);
app.use('/cloudinary', cloudinaryRoutes);
app.use('/reviews', reviewRouter);
app.use('/withdrawals', withdrawalRoutes);
app.use('/wallet',walletRoutes);
app.use('/notifications',notificationRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((err: Error, req: Request, res: Response) => {
    errorHandler(err, req, res);
});

// Initialize PaymentStatusChecker
const paymentService = container.get<IPaymentService>(TYPES.PaymentService);
new PaymentStatusChecker(paymentService);

export default app

