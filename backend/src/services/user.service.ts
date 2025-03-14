import { inject, injectable } from "inversify";
import { IUsers } from "../models/user.model";
import { ChangePasswordResponse } from "./inspector.service";
import bcrypt from 'bcrypt'
import { BaseService } from "../core/abstracts/base.service";
import { IUserService } from "../core/interfaces/services/user.service.interface";
import { TYPES } from "../di/types";
import { Types } from "mongoose";
import { IUserRepository } from "../core/interfaces/repositories/user.repository.interface";
import { ServiceError } from "../core/errors/service.error";


@injectable()
export class UserService extends BaseService<IUsers> implements IUserService {
    constructor(@inject(TYPES.UserRepository) private _userRepository: IUserRepository) {
        super(_userRepository);
    }
    async toggleStatus(userId: string) {
        try {
            const user = await this._userRepository.findById(new Types.ObjectId(userId));
            if (!user) {
                throw new ServiceError('User not found');
            }

            const updateData = {
                status: !user.status
            }
            const updatedUser = await this._userRepository.update(
                new Types.ObjectId(userId),
                updateData
            );
            if (!updatedUser) {
                throw new ServiceError('Failed to update user status');
            }
            return updatedUser;
        } catch (error) {
            console.error('Error in toggleStatus:', error);
            throw error;
        }
    }
    async changePassword(currentPassword: string, newPassword: string, userId: string): Promise<ChangePasswordResponse> {
        try {
            const isValid = await this._userRepository.findById(new Types.ObjectId(userId))
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
            const response = await this._userRepository.update(new Types.ObjectId(userId), {
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

