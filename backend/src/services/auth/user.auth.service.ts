import { generateAccessToken, verifyRefreshToken } from "../../utils/token.utils";
import bcrypt from 'bcrypt'
import { generateOtp } from "../../utils/otp";
import redisClient from "../../config/redis.config";
import appConfig from "../../config/app.config";
import { sendEmail } from "../../utils/email";
import crypto from "crypto";
import { BaseAuthService } from "../../core/abstracts/base.auth.service";
import { IUserAuthService } from "../../core/interfaces/services/auth.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ServiceError } from "../../core/errors/service.error";
import { IUserRepository } from "../../core/interfaces/repositories/user.repository.interface";

@injectable()
export class UserAuthService extends BaseAuthService implements IUserAuthService {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {
        super();
    }
    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; }> {
        try {
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new ServiceError('User not found', 'email');
            }
            if (!user.password) {
                throw new ServiceError('Password is required', 'password');
            }
            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                throw new ServiceError('Invalid password', 'password');
            }
            if (!user.status) {
                throw new ServiceError('Account is blocked', 'email');
            }
            const payload = { userId: user.id, role: user.role };
            return this.generateTokens(payload);
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('login failed', 'email');
        }
    }

    async refreshToken(token: string): Promise<{ accessToken: string, status?: boolean, blockReason?: string }> {
        try {
            const payload = await verifyRefreshToken(token)
            if (!payload?.userId || !payload?.role) {
                throw new ServiceError('Invalid token payload', 'token')
            }
            const user = await this.userRepository.findById(payload.userId)
            if (!user || !user.status) {
                return { accessToken: '', status: false, blockReason: "This User Account is Blocked" }
            }
            const newAccessToken = generateAccessToken({ userId: payload.userId, role: payload.role })
            return { accessToken: newAccessToken, status: true, blockReason: "" }
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Refresh Failed', 'refresh')
        }
    }

    async registerUser(email: string, password: string, firstName: string, lastName: string): Promise<{ message: string }> {
        const existingUser = await this.userRepository.findUserByEmail(email)

        if (existingUser) {
            throw new Error('user already Exist');
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const otp = generateOtp();
        const redisKey = `user:register:${email}`;
        await redisClient.set(redisKey, JSON.stringify({ email, hashPassword, firstName, lastName, otp }), { EX: appConfig.otpExp });
        await sendEmail(email, 'Your Inspecto OTP', `Your OTP is ${otp}`);
        return { message: 'OTP send successfully' }
    }

    async verifyOTP(email: string, otp: string,) {
        const redisKey = `user:register:${email}`;
        const userData = await redisClient.get(redisKey)

        if (!userData) {
            throw new Error("OTP expired or invalid");
        }

        const parsedData = JSON.parse(userData)
        if (parsedData.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        const newUser = await this.userRepository.create({ firstName: parsedData.firstName, lastName: parsedData.lastName, email: parsedData.email, password: parsedData.hashPassword })
        await redisClient.del(redisKey)
        const payload = { userId: newUser.id, role: newUser.role }
        const { accessToken, refreshToken } = this.generateTokens(payload)
        return { message: "User registerd successfully", accessToken, refreshToken }
    }
    async resendOTP(email: string) {
        const redisKey = `user:register:${email}`
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
    async googleLoginOrRegister(email: string | undefined, name: string | undefined, picture: string | undefined, family_name: string | undefined) {
        if (!email || !name) {
            throw new Error("Google account lacks required information");
        }
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) {
            await this.userRepository.create({
                email,
                firstName: name,
                lastName: family_name,
                profile_image: picture,
                authProvider: "google",
                password: null
            })
        }
        if (!user) {
            throw new Error("User not found");
        }
        const { accessToken, refreshToken } = this.generateTokens({ userId: user.id, role: user.role });
        return { user, accessToken, refreshToken };
    }
    async forgetPassword(email: string, role: string) {
        const user = await this.userRepository.findUserByEmail(email)
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
        await this.userRepository.updateUserPassword(email, password = hashPassword)
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


