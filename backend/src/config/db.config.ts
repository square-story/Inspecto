import mongoose from 'mongoose';
import appConfig from './app.config';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(appConfig.databaseUrl);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};
