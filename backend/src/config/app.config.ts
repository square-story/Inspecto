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
    frontEndUrl: string;
    cloud_name: string,
    api_key: string,
    api_secret: string
}

const appConfig: AppConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL as string,
    accessToken: process.env.ACCESS_TOKEN_SECRET as string,
    refreshToken: process.env.REFRESH_TOKEN_SECRET as string,
    accessTime: process.env.ACCESS_TOKEN_EXPIRATION as string,
    refreshTime: process.env.REFRESH_TOKEN_EXPIRATION as string,
    redisHost: process.env.REDIS_HOST as string,
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    otpExp: parseInt(process.env.OTP_EXPIRY || '300', 10),
    stripSecret: process.env.STRIPE_SECRET_KEY || '',
    stripWebhook: process.env.STRIPE_WEBHOOK_SECRET || '',
    frontEndUrl: process.env.FRONTEND_URL || '',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
};

export default appConfig;