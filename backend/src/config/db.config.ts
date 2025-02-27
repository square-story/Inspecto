import mongoose from 'mongoose';
import appConfig from './app.config';

const uri = appConfig.databaseUrl || 'mongodb+srv://<username>:<password>@<cluster-url>/inspectodb?retryWrites=true&w=majority';

export const connectToDatabase = async () => {
    await mongoose.connect(uri)
        .then(() => console.log('Connected to MongoDB Atlas replica set'))
        .catch(err => console.error('Failed to connect to MongoDB', err));
};