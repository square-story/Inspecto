import { Response } from "express";
import UserRepository from "../../repositories/user.repository";
import { generateAccessToken, verifyAccessToken, generateRefreshToken } from "../../utils/token.utils";
import bcrypt from 'bcrypt'
import User, { IUsers } from '../../models/user.model';

export class UserAuthService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepository()
    }
    async login(email: string, password: string, res: Response) {
        const user = await this.userRepository.findUserByEmail(email)
        if (!user || user.password !== password) {
            throw new Error('Invalid password or Email')
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

    async registerUser(email: string, password: string, firstName: string, lastName: string): Promise<IUsers> {
        const existingUser = await this.userRepository.findUserByEmail(email)

        if (existingUser) {
            throw new Error('User with this Email already exists')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user: Partial<IUsers> = {
            firstName,
            lastName,
            email,
            password: hashPassword
        }
        return await this.userRepository.createUser(user)
    }

}


