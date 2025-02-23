import { inject, injectable } from "inversify";
import { IUsers } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { ChangePasswordResponse } from "./inspector.service";
import bcrypt from 'bcrypt'
import { BaseService } from "../core/abstracts/base.service";
import { IUserService } from "../core/interfaces/services/user.service.interface";
import { TYPES } from "../di/types";
import { Types } from "mongoose";


@injectable()
export class UserService extends BaseService<IUsers> implements IUserService {
    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
        super(userRepository);
    }
    async createUser(userData: IUsers) {
        const existingUser = await this.userRepository.findUserByEmail(userData.email)

        if (existingUser) {
            throw new Error('Email already exists')
        }

        return await this.userRepository.create(userData);
    }
    async findUsersByEmail(email: string) {
        return await this.userRepository.findUserByEmail(email)
    }
    async findUserByUserId(userId: string) {
        return await this.userRepository.findById(new Types.ObjectId(userId))
    }
    async updateUser(userId: string, updates: Partial<IUsers>) {
        return await this.userRepository.update(new Types.ObjectId(userId), updates)
    }
    async deleteUser(userId: string) {
        return await this.userRepository.deleteOne(new Types.ObjectId(userId))
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
    async toggleStatus(userId: string) {
        const user = await this.userRepository.findById(new Types.ObjectId(userId));
        if (!user) {
            throw new Error('User not found');
        }

        const updateData = {
            status: !user.status
        }
        const updatedUser = await this.userRepository.update(
            new Types.ObjectId(userId),
            updateData
        );
        if (!updatedUser) {
            throw new Error('Failed to update user status');
        }
        return updatedUser;
    }
    async changePassword(currentPassword: string, newPassword: string, userId: string): Promise<ChangePasswordResponse> {
        try {
            const isValid = await this.userRepository.findById(new Types.ObjectId(userId))
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
            const response = await this.userRepository.update(new Types.ObjectId(userId), {
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

