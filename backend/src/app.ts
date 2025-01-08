import express, { Request, Response } from "express";
import appConfig from "./config/app.config";
import { connectToDatabase } from "./config/db.config";
import adminRoutes from "./routes/admin.routes";
import { authenticateToken } from "./middlewares/auth.middleware";

const app = express()

app.use(express.json()); //for Parsing JSON request bodies

//connect Database
connectToDatabase();

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