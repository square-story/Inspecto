import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import UserRepository from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth";

const REFRESH_TOKENS: string[] = [] // Temporary in-memory storage for refresh tokens.

class AuthController {
    //register user
    async register(req: Request, res: Response) {
        try {
            const { FirstName, LastName, Email, Password } = req.body

            const existingUser = await UserRepository.findUserByEmail(Email)
            if (existingUser) return res.status(400).json({ message: 'User already exists' })

            const hashedPassword = await bcrypt.hash(Password, 10);

            const newUser = await UserRepository.createUser({
                FirstName,
                LastName,
                Email,
                Password: hashedPassword,
                Created_at: new Date(),
                Updated_at: new Date(),
                Address: null,
                Profile_image: null,
                Status: true,
            });

            return res.status(201).json({ message: 'User registerd successfully', user: newUser })
        } catch (error) {
            return res.status(500).json({ message: 'server error', error })
        }
    }
    //login user
    async login(req: Request, res: Response) {
        try {
            const { Email, Password } = req.body;
            const user = await UserRepository.findUserByEmail(Email)
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const comparePassword = bcrypt.compare(Password, user.Password)
            if (!comparePassword) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }
            const accessToken = generateAccessToken({ userId: user._id.toString() })
            const refreshToken = generateRefreshToken({ userId: user._id.toString() })

            return res.status(200).json({ accessToken, refreshToken })
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error })
        }
    }
    async refresh(req: Request, res: Response) {
        try {
            const { token } = req.body;
            if (!token || !REFRESH_TOKENS.includes(token)) {
                return res.status(403).json({ message: 'Invalid Refresh Token' })
            }

            const payload = verifyRefreshToken(token)
            if (!payload) {
                return res.status(403).json({ message: 'Invalid or Expired refresh Token' })
            }
            const newAccessToken = generateAccessToken({ userId: payload.userId })
            return res.status(200).json({ accessToken: newAccessToken })
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Issues' })
        }
    }
}

export default new AuthController();