import { inject, injectable } from "inversify";
import { IAdminService } from "../core/interfaces/services/admin.service.interface";
import { TYPES } from "../di/types";
import { IAdmin } from "../models/admin.model";
import { BaseService } from "../core/abstracts/base.service";
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
import { TransactionType, WalletOwnerType } from "../models/wallet.model";
import { format } from "date-fns";

@injectable()
export class AdminService extends BaseService<IAdmin> implements IAdminService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.InspectorRepository) private _inspectorRepository: IInspectorRepository,
        @inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository,
        @inject(TYPES.InspectionRepository) private _inspectionRepository: IInspectionRepository,
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
    ) {
        super(_adminRepository);
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        try {
            return await this.repository.findOne({ email });
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error finding admin by email: ${error.message}`);
            }
            throw error;
        }
    }

    async getAllInspectors(): Promise<IInspector[]> {
        try {
            return await this._inspectorRepository.findAll();
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting all inspectors: ${error.message}`);
            }
            throw error;
        }
    }

    async getAllUsers(): Promise<IUsers[]> {
        try {
            return await this._userRepository.getAllUsers();
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

            const earningData = () => {
                return fullWalletTransactions.reduce((acc, transaction) => {
                    const month = format(new Date(transaction.date), 'MMM');
                    const existing = acc.find(item => item.name === month);
                    const amount = transaction.amount;

                    if (existing) {
                        existing.total += amount;
                        if (transaction.type === "PLATFORM_FEE") {
                            existing.platformFee += amount;
                        } else {
                            existing.inspectorFee += amount;
                        }
                    } else {
                        acc.push({
                            name: month,
                            platformFee: transaction.type === "PLATFORM_FEE" ? amount : 0,
                            inspectorFee: transaction.type !== "PLATFORM_FEE" && transaction.type !== TransactionType.REFUND ? amount : 0,
                            total: amount
                        });
                    }
                    return acc;
                }, [] as { name: string; platformFee: number; inspectorFee: number; total: number }[]);
            };

            return { totalUsers, totalInspectors, totalInspections, totalEarnings, earningData: earningData() };

        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting admin dashboard stats: ${error.message}`);
            }
            throw error;
        }
    }
}