import express, { Request, Response } from "express";
import appConfig from "./config/app.config";
import { connectToDatabase } from "./config/db.config";
import cookieParser from 'cookie-parser'
import adminRoutes from "./routes/admin.routes";
import userRoutes from './routes/user.routes'
import inspectorRoutes from "./routes/inspector.routes";
import vehiclesRoutes from "./routes/vehicles.routes"
import cors from "cors";

const app = express()

app.use(express.json({ limit: '50mb' })); //for Parsing JSON request bodies
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser());

//connect Database
connectToDatabase();

app.use(cors({
    origin: 'http://localhost:5173',
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

//for Admin Operations
app.use('/admin', adminRoutes)
//inspectors Operations
app.use('/inspector', inspectorRoutes)
//user Operations
app.use('/user', userRoutes)
//vehicles operations
app.use('/vehicles', vehiclesRoutes)


app.use((req: Request, res: Response) => {
    res.status(404).send('rote not found')
})

app.listen(appConfig.port, () => {
    console.log(`server is running on port ${appConfig.port}`)
})