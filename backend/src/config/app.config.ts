import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(
  process.cwd(),
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
);
console.log(`Environment variables loaded from ${envPath} and NODE_ENV is ${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });


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
  cloud_name: string;
  api_key: string;
  api_secret: string;
  adminId: string;
  googleClientId: string;
  adminEmail: string;
  adminPassword?: string;
}

const validateEnv = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'REDIS_HOST'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
};

validateEnv();

const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL as string,
  accessToken: process.env.ACCESS_TOKEN_SECRET as string,
  refreshToken: process.env.REFRESH_TOKEN_SECRET as string,
  accessTime: process.env.ACCESS_TOKEN_EXPIRATION as string,
  refreshTime: process.env.REFRESH_TOKEN_EXPIRATION as string,
  redisHost: process.env.REDIS_HOST as string,
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  smtpHost: process.env.SMTP_HOST!,
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER!,
  smtpPass: process.env.SMTP_PASS!,
  otpExp: parseInt(process.env.OTP_EXPIRY || '300', 10),
  stripSecret: process.env.STRIPE_SECRET_KEY!,
  stripWebhook: process.env.STRIPE_WEBHOOK_SECRET!,
  frontEndUrl: process.env.FRONTEND_URL!,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  adminId: process.env.ADMIN_ID!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  adminEmail: process.env.ADMIN_EMAIL!,
  adminPassword: process.env.ADMIN_PASSWORD,
};

export default appConfig;