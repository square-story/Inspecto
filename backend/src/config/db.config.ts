import mongoose from 'mongoose';
import appConfig from './app.config';

const uri = appConfig.databaseUrl;

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri, {
            // These options help with MongoDB Atlas connections
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        // For production, you might want to implement retry logic here
        throw err;
    }
};