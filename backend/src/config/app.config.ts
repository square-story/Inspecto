import * as dotenv from 'dotenv';

dotenv.config();

interface AppConfig {
    port: number;
    databaseUrl: string;
    accessToken: string;
    refreshToken: string;
    accessTime: string,
    refreshTime: string
}

const appConfig: AppConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/inspectodb',
    accessToken: process.env.ACCESS_TOKEN_SECRET || 'Access Secret',
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'Refresh Secret',
    accessTime: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
    refreshTime: process.env.REFRESH_TOKEN_EXPIRATION || '7d'
};

export default appConfig;