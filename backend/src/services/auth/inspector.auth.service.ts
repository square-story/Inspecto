import { Response } from "express";
import { InspectorRepository } from "../../repositories/inspector.repository";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.utils";
import { generateOtp } from "../../utils/otp";
import redisClient from "../../config/redis.config";
import appConfig from "../../config/app.config";
import { sendEmail } from "../../utils/email";
import crypto from 'crypto'
import { InspectorStatus } from "../../models/inspector.model";
import { IAuthService, IInspectorAuthService } from "../../core/interfaces/services/auth.service.interface";
import { BaseAuthService } from "../../core/abstracts/base.auth.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { Types } from "mongoose";
import { IInspectorRepository } from "../../core/interfaces/repositories/inspector.repository.interface";
import { ServiceError } from '../../core/errors/service.error';

@injectable()
export class InspectorAuthService extends BaseAuthService implements IInspectorAuthService {

    constructor(
        @inject(TYPES.InspectorRepository) private readonly inspectorRepository: IInspectorRepository
    ) {
        super();
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const inspector = await this.inspectorRepository.findInspectorByEmail(email);
            if (!inspector) {
                throw new ServiceError('Inspector not found', 'email');
            }
            if (!inspector.password) {
                throw new ServiceError('Password is required', 'Password');
            }
            const isPasswordValid = await bcrypt.compare(password, inspector.password);
            if (!isPasswordValid) {
                throw new ServiceError('Password is incorrect', 'password');
            }
            if (inspector.status === InspectorStatus.BLOCKED) {
                throw new ServiceError('Account is Blocked', 'email');
            }
            const payload = { userId: inspector.id, role: inspector.role };
            return this.generateTokens(payload);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('login failed', 'email');
        }
    }
    async refreshToken(token: string): Promise<{ accessToken: string, status?: boolean, blockReason?: string }> {
        const payload = verifyRefreshToken(token);
        if (!payload?.userId || !payload?.role) {
            throw new Error('Invalid token payload');
        }
        const inspector = await this.inspectorRepository.findById(new Types.ObjectId(payload.userId.toString()));

        if (!inspector || inspector.status === InspectorStatus.BLOCKED) {
            return { accessToken: '', status: false, blockReason: "This User Account is Blocked" }
        }
        const newAccessToken = await generateAccessToken({ userId: payload.userId, role: payload.role });
        return { accessToken: newAccessToken, status: true, blockReason: "" };
    }

    async registerInspector(email: string, password: string, firstName: string, lastName: string, phone: string) {
        const existing = await this.inspectorRepository.findInspectorByEmail(email)
        if (existing) {
            throw new Error('User Already Exising')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const otp = generateOtp()
        const redisKey = `inspector:register:${email}`;
        await redisClient.set(redisKey, JSON.stringify({ email, hashPassword, firstName, lastName, otp, phone }), { EX: appConfig.otpExp });
        await sendEmail(email, 'Your Inspecto OTP', `Your OTP is ${otp}`);
        return { message: 'OTP send successfully' }
    }
    async verifyOTP(email: string, otp: string) {
        const redisKey = `inspector:register:${email}`;
        const userData = await redisClient.get(redisKey)
        if (!userData) {
            throw new Error("OTP expired or invalid");
        }
        const parsedData = JSON.parse(userData)
        if (parsedData.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        const newInspector = await this.inspectorRepository.createInspector({ firstName: parsedData.firstName, lastName: parsedData.lastName, email: parsedData.email, password: parsedData.hashPassword, phone: parsedData.phone })
        await redisClient.del(redisKey)
        const payload = { userId: newInspector.id, role: newInspector.role }
        const { accessToken, refreshToken } = this.generateTokens(payload)
        return { message: "Inspector registered successfully", accessToken, refreshToken }
    }
    async resendOTP(email: string) {
        const redisKey = `inspector:register:${email}`
        const userData = await redisClient.get(redisKey)

        if (!userData) {
            throw new Error("Cannot resend OTP. Registration session Expired.");
        }

        const parsedData = JSON.parse(userData)

        const newOTP = generateOtp()
        parsedData.otp = newOTP
        await redisClient.set(redisKey, JSON.stringify(parsedData), { EX: appConfig.otpExp })

        await sendEmail(email, "Your Inspecto OTP(resent)", `Your new OTP is ${newOTP}`)
        return { message: 'OTP resent successfully' }
    }
    async forgetPassword(email: string, role: string) {
        const user = await this.inspectorRepository.findInspectorByEmail(email)
        if (!user) {
            throw new Error('User not found')
        }
        const { hashedToken, resetToken } = this.generateToken()

        const redisKey = `resetToken:${email}`
        await redisClient.set(redisKey, hashedToken, { EX: 3600 }) //1 hour
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}&role=${role}`;
        await sendEmail(email, 'Password Reset Request', `Click here to reset your password: ${resetUrl}`);
        return { message: 'Reset link sent successfully' }
    }
    async resetPassword(token: string, email: string, password: string) {
        const isValid = await this.validateToken(email, token);
        if (!isValid) {
            throw new Error('Invalid or expired token');
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await this.inspectorRepository.updateInspectorPassword(email, password = hashPassword)
        const redisKey = `resetToken:${email}`
        await redisClient.del(redisKey)
        return { message: 'Password reset successful' }
    }
    private generateToken() {
        const resetToken = crypto.randomUUID();
        const hashedToken = crypto
            .createHmac("sha256", process.env.CRYPTO_TOKEN_SECRET || 'DEFAULT_SOME')
            .update(resetToken)
            .digest("hex");
        return { resetToken, hashedToken }
    }
    private async validateToken(email: string, providedToken: string): Promise<boolean> {
        const redisKey = `resetToken:${email}`
        const storedHasedKey = await redisClient.get(redisKey)
        if (!storedHasedKey) {
            return false
        }
        const hashProvidedToken = crypto
            .createHmac("sha256", process.env.CRYPTO_TOKEN_SECRET || 'DEFAULT_SOME')
            .update(providedToken)
            .digest('hex')
        return storedHasedKey === hashProvidedToken;
    }
}