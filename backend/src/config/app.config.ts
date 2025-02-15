import * as dotenv from 'dotenv';

dotenv.config();

interface AppConfig {
    port: number;
    databaseUrl: string;
    accessToken: string;
    refreshToken: string;
    accessTime: string;
    refreshTime: string;
    redisHost: string;
    redisPort: number;
    smtpHost: string;
    smtpPort: number
    smtpUser: string;
    smtpPass: string;
    otpExp: number;
    stripSecret: string;
    stripWebhook: string;
}

const appConfig: AppConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/inspectodb',
    accessToken: process.env.ACCESS_TOKEN_SECRET || 'Access Secret',
    refreshToken: process.env.REFRESH_TOKEN_SECRET || 'Refresh Secret',
    accessTime: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
    refreshTime: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    otpExp: parseInt(process.env.OTP_EXPIRY || '300', 10),
    stripSecret: process.env.STRIPE_SECRET_KEY || '',
    stripWebhook: process.env.STRIPE_WEBHOOK_SECRET || '',
};

export default appConfig;