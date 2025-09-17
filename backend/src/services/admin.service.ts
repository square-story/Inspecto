import { inject, injectable } from "inversify";
import { IAdminService, PaginationParams, PaginatedResult } from "../core/interfaces/services/admin.service.interface";
import { TYPES } from "../di/types";
import { IAdmin } from "../models/admin.model";
import { IUserRepository } from "../core/interfaces/repositories/user.repository.interface";
import { IInspectorRepository } from "../core/interfaces/repositories/inspector.repository.interface";
import { ServiceError } from "../core/errors/service.error";
import { IUsers } from "../models/user.model";
import { IInspector, InspectorStatus } from "../models/inspector.model";
import { IAdminRepository } from "../core/interfaces/repositories/admin.repository.interface";
import { IInspectionRepository } from "../core/interfaces/repositories/inspection.repository.interface";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { IAdminDashboardStats } from "../core/types/admin.dasboard.stats.type";
import { InspectionStatus } from "../models/inspection.model";
import { WalletOwnerType } from "../models/wallet.model";
import { earningData } from "../utils/earningsData";

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.InspectorRepository) private _inspectorRepository: IInspectorRepository,
        @inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository,
        @inject(TYPES.InspectionRepository) private _inspectionRepository: IInspectionRepository,
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
    ) {
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        try {
            return await this._adminRepository.findOne({ email });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding admin by email: ${error.message}`);
            }
            throw error;
        }
    }

    async getAllInspectors(params: PaginationParams): Promise<PaginatedResult<IInspector>> {
        try {
            const { page, limit, search, isListed } = params;
            const skip = (page - 1) * limit;

            // Build filter criteria
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filter: any = {};

            if (isListed !== undefined) {
                filter.isListed = isListed;
            }

            // Add search functionality
            if (search) {
                filter.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            // Get all inspectors matching the filter
            const allInspectors = await this._inspectorRepository.find(filter);

            // Get total count for pagination
            const total = allInspectors.length;

            // Apply pagination and sorting manually
            const inspectors = allInspectors
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(skip, skip + limit);

            return {
                users: inspectors,
                total
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting all inspectors: ${error.message}`);
            }
            throw error;
        }
    }

    async getAllUsers(params: PaginationParams): Promise<PaginatedResult<IUsers>> {
        try {
            const { page, limit, search } = params;
            const skip = (page - 1) * limit;

            // Build filter criteria
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filter: any = {};

            // Add search functionality
            if (search) {
                filter.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                ];
            }

            // Get all users matching the filter
            const allUsers = await this._userRepository.find(filter);

            // Get total count for pagination
            const total = allUsers.length;

            const users = allUsers
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(skip, skip + limit);

            return {
                users,
                total
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting all users: ${error.message}`);
            }
            throw error;
        }
    }
    async getAdminDashboardStats(): Promise<IAdminDashboardStats> {
        try {
            const totalUsers = await this._userRepository.find({}).then(users => users.length);
            const totalInspectors = await this._inspectorRepository.find({ status: InspectorStatus.APPROVED }).then(inspectors => inspectors.length);
            const totalInspections = await this._inspectionRepository.find({ status: InspectionStatus.COMPLETED }).then(inspections => inspections.length);
            const totalEarnings = await this._walletRepository.findOne({ ownerType: WalletOwnerType.ADMIN }).then(wallet => wallet?.totalEarned || 0);

            const fullWalletTransactions = (await this._walletRepository.find({})).map(wallet => wallet.transactions).flat();

            return { totalUsers, totalInspectors, totalInspections, totalEarnings, earningData: earningData(fullWalletTransactions) };

        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting admin dashboard stats: ${error.message}`);
            }
            throw error;
        }
    }
}