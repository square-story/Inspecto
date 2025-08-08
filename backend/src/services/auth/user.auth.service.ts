import { generateAccessToken, generateTokens, verifyRefreshToken } from "../../utils/token.utils";
import bcrypt from 'bcrypt'
import { generateOtp } from "../../utils/otp";
import redisClient from "../../config/redis.config";
import appConfig from "../../config/app.config";
import { sendEmail } from "../../utils/email";
import crypto from "crypto";
import { IUserAuthService } from "../../core/interfaces/services/auth.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ServiceError } from "../../core/errors/service.error";
import { IUserRepository } from "../../core/interfaces/repositories/user.repository.interface";
import { IUsers } from "../../models/user.model";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(appConfig.googleClientId)

@injectable()
export class UserAuthService implements IUserAuthService {

    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository
    ) {
    }
    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; }> {
        try {
            const user = await this._userRepository.findUserByEmail(email);
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
            return generateTokens(payload);
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
            const user = await this._userRepository.findById(payload.userId)
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
        const existingUser = await this._userRepository.findUserByEmail(email)

        if (existingUser) {
            throw new ServiceError('user already Exist');
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
            throw new ServiceError("OTP expired or invalid");
        }

        const parsedData = JSON.parse(userData)
        if (parsedData.otp !== otp) {
            throw new ServiceError('Invalid OTP');
        }

        const newUser = await this._userRepository.create({ firstName: parsedData.firstName, lastName: parsedData.lastName, email: parsedData.email, password: parsedData.hashPassword })
        await redisClient.del(redisKey)
        const payload = { userId: newUser.id, role: newUser.role }
        const { accessToken, refreshToken } = generateTokens(payload)
        return { message: "User registerd successfully", accessToken, refreshToken }
    }
    async resendOTP(email: string) {
        const redisKey = `user:register:${email}`
        const userData = await redisClient.get(redisKey)

        if (!userData) {
            throw new ServiceError("Cannot resend OTP. Registration session Expired.");
        }

        const parsedData = JSON.parse(userData)

        const newOTP = generateOtp()
        parsedData.otp = newOTP
        await redisClient.set(redisKey, JSON.stringify(parsedData), { EX: appConfig.otpExp })

        await sendEmail(email, "Your Inspecto OTP(resent)", `Your new OTP is ${newOTP}`)
        return { message: 'OTP resent successfully' }
    }

    async googleLoginOrRegister(token: string): Promise<{ user: IUsers; accessToken: string; refreshToken: string; }> {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: appConfig.googleClientId
            })
            const { email, name, picture, family_name } = ticket.getPayload()!;

            if (!email || !name || !picture) {
                throw new ServiceError("Invalid google login");
            }

            let user = await this._userRepository.findUserByEmail(email)

            if (!user) {
                user = await this._userRepository.create({
                    email,
                    firstName: name,
                    lastName: family_name || "",
                    profile_image: picture,
                    authProvider: "google",
                    password: null
                })
            }
            const { accessToken, refreshToken } = generateTokens({ userId: user.id, role: user.role });
            return { user, accessToken, refreshToken };
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            throw new ServiceError('Something Wrong in the google login, Please try again after some time')
        }
    }
    async forgetPassword(email: string, role: string) {
        const user = await this._userRepository.findUserByEmail(email)
        if (!user) {
            throw new ServiceError('User not found')
        }
        const { hashedToken, resetToken } = this.generateToken()

        const redisKey = `resetToken:${email}`
        await redisClient.set(redisKey, hashedToken, { EX: 3600 }) //1 hour
        const resetUrl = `${appConfig.frontEndUrl}/reset-password?token=${resetToken}&email=${email}&role=${role}`;
        await sendEmail(email, 'Password Reset Request', `Click here to reset your password: ${resetUrl}`);
        return { message: 'Reset link sent successfully' }
    }
    async resetPassword(token: string, email: string, password: string) {
        const isValid = await this.validateToken(email, token);
        if (!isValid) {
            throw new ServiceError('Invalid or expired token');
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await this._userRepository.updateUserPassword(email, password = hashPassword)
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


