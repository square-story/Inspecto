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
import { INotificationService } from "../core/interfaces/services/notification.service.interface";
import { NotificationType } from "../models/notification.model";
import { IUserDashboardStats } from "../core/types/user.dashboard.stats.type";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { IVehicleRepository } from "../core/interfaces/repositories/vehicle.repository.interface";


@injectable()
export class UserService extends BaseService<IUsers> implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.NotificationService) private _notificationService: INotificationService,
        @inject(TYPES.InspectionRepository) private _inspectionRepository: IInspectionRepository,
        @inject(TYPES.VehicleRepository) private _vehicleRepository: IVehicleRepository,
    ) {
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

                await this._notificationService.createAndSendNotification(
                    userId,
                    "User",
                    NotificationType.SYSTEM,
                    "Password Changed",
                    "Your password has been changed successfully.",
                    {
                        userId
                    }
                )

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

    async getUserDashboard(userId: string): Promise<IUserDashboardStats> {
        try {
            const user = await this._userRepository.findById(new Types.ObjectId(userId));
            if (!user) {
                throw new ServiceError('User not found');
            }

            const upcomingInspections = await this._inspectionRepository.getUpcomingInspectionsByUser(userId);
            const completedInspections = await this._inspectionRepository.getCompletedInspectionsByUser(userId);
            const myVehicles = await this._vehicleRepository.findVehiclesByUser(userId);

            return {
                upcomingInspections: upcomingInspections.length,
                completedInspections: completedInspections.length,
                myVehicles: myVehicles.length,
                upcomingInspectionsList: upcomingInspections,
                completedInspectionsList: completedInspections,
                myVehiclesList: myVehicles,
            };
        } catch (error) {
            console.error('Error in getUserDashboard:', error);
            throw error;
        }
    }
}

