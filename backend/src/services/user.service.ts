import { IUsers } from "../models/user.model";
import UserRepository from "../repositories/user.repository";
import { ChangePasswordResponse } from "./inspector.service";
import bcrypt from 'bcrypt'



export class UserService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepository()
    }
    async createUser(userData: IUsers) {
        const existingUser = await this.userRepository.findUserByEmail(userData.email)

        if (existingUser) {
            throw new Error('Email already exists')
        }

        return await this.userRepository.createUser(userData);
    }
    async findUsersByEmail(email: string) {
        return await this.userRepository.findUserByEmail(email)
    }
    async findUserByUserId(userId: string) {
        return await this.userRepository.findById(userId)
    }
    async updateUser(userId: string, updates: Partial<IUsers>) {
        return await this.userRepository.updateUser(userId, updates)
    }
    async deleteUser(userId: string) {
        return await this.userRepository.deleteUser(userId)
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
    async toggleStatus(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updateData = {
            status: !user.status
        }
        const updatedUser = await this.userRepository.updateUser(
            userId,
            updateData
        );
        if (!updatedUser) {
            throw new Error('Failed to update user status');
        }
        return updatedUser;
    }
    async changePassword(currentPassword: string, newPassword: string, userId: string): Promise<ChangePasswordResponse> {
        try {
            const isValid = await this.userRepository.findById(userId)
            if (!isValid) {
                return {
                    status: false,
                    message: 'The user is not available.',
                };
            }
            const isMatch = await bcrypt.compare(currentPassword, isValid.password as string);
            if (!isMatch) {
                return {
                    status: false,
                    message: 'The current password is incorrect.',
                };
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const response = await this.userRepository.updateUser(userId, {
                password: hashedNewPassword,
            });
            if (response) {
                return {
                    status: true,
                    message: 'The password has been changed successfully.',
                };
            } else {
                return {
                    status: false,
                    message: 'Failed to update the password.',
                };
            }
        } catch (error) {
            console.error('Error in changePassword:', error);
            throw error;
        }
    }
}

