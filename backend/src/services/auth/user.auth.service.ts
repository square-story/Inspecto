import { Response } from "express";
import UserRepository from "../../repositories/user.repository";
import { generateAccessToken, verifyAccessToken, generateRefreshToken } from "../../utils/token.utils";
import bcrypt from 'bcrypt'
import User, { IUsers } from '../../models/user.model';
import { generateOtp } from "../../utils/otp";
import redisClient from "../../config/redis";
import appConfig from "../../config/app.config";
import { sendEmail } from "../../utils/email";

export class UserAuthService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepository()
    }
    async login(email: string, password: string, res: Response) {
        const user = await this.userRepository.findUserByEmail(email)
        if (!user) {
            throw new Error('User Not Found')
        }
        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            throw new Error('The Password is inCorrect')
        }
        const payload = { userId: user.id, role: user.role }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return ({ accessToken })
    }
    async refreshToken(token: string) {
        const payload = await verifyAccessToken(token)
        if (!payload?.userId || !payload?.role) {
            throw new Error('Invalid token payload')
        }
        const newAccessToken = generateAccessToken({ userId: payload.userId, role: payload.role })
        return { accessToken: newAccessToken }
    }

    async registerUser(email: string, password: string, firstName: string, lastName: string): Promise<{ message: string }> {
        const existingUser = await this.userRepository.findUserByEmail(email)
        if (existingUser) {
            throw new Error('User with this Email already exists')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const otp = generateOtp();
        const redisKey = `user:register:${email}`;
        await redisClient.set(redisKey, JSON.stringify({ email, hashPassword, firstName, lastName, otp }), { EX: appConfig.otpExp });
        await sendEmail(email, 'Your Inspecto OTP', `Your OTP is ${otp}`);
        return { message: 'OTP send successfully' }
    }
    async verifyOTP(email: string, otp: string) {
        const redisKey = `user:register:${email}`;
        const userData = await redisClient.get(redisKey)

        if (!userData) {
            throw new Error("OTP expired or invalid");
        }

        const parsedData = JSON.parse(userData)
        if (parsedData.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        const newUser = await this.userRepository.createUser({ firstName: parsedData.firstName, lastName: parsedData.lastName, email: parsedData.email, password: parsedData.hashPassword })
        await redisClient.del(redisKey)
        return { message: "User registerd successfully", user: newUser }
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
}


