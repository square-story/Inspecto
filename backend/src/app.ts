import express, { Request, Response } from "express";
import appConfig from "./config/app.config";
import { connectToDatabase } from "./config/db.config";
import cookieParser from 'cookie-parser'
import adminRoutes from "./routes/admin.routes";
import cors from "cors";

const app = express()

app.use(express.json()); //for Parsing JSON request bodies

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


app.use('/admin', adminRoutes) //connect the routes like this


app.use((req, res) => {
    res.status(404).send('rote not found')
})

app.listen(appConfig.port, () => {
    console.log(`server is running on port ${appConfig.port}`)
})