import "reflect-metadata";
import express, { Request, Response } from "express";
import appConfig from "./config/app.config";
import { connectToDatabase } from "./config/db.config";
import cookieParser from 'cookie-parser'
import adminRoutes from "./routes/admin.routes";
import userRoutes from './routes/user.routes'
import inspectorRoutes from "./routes/inspector.routes";
import vehiclesRoutes from "./routes/vehicles.routes"
import inspectionRoutes from "./routes/inspection.routes"
import paymentsRoutes from './routes/payment.routes'
import cors from "cors";

const app = express()

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

app.use(cookieParser());

// Connect Database
connectToDatabase();

app.use(cors({
    origin: appConfig.frontEndUrl,
    credentials: true
}));

app.get('/', (req: Request, res: Response) => {
    res.send('server is up and running')
})

app.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
})

// Routes
app.use('/admin', adminRoutes)
app.use('/inspector', inspectorRoutes)
app.use('/user', userRoutes)
app.use('/vehicles', vehiclesRoutes)
app.use('/inspections', inspectionRoutes)
app.use('/payments', paymentsRoutes)


app.use((req: Request, res: Response) => {
    res.status(404).send('route not found')
})

app.listen(appConfig.port, () => {
    console.log(`server is running on port ${appConfig.port}`)
})

