import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IWithdrawalRepository } from "../core/interfaces/repositories/withdrawal.repository.interface";
import { BaseService } from "../core/abstracts/base.service";
import { IWithdrawal, WithdrawalMethod, WithdrawalStatus } from "../models/withdrawal.model";
import { IWithDrawalService } from "../core/interfaces/services/withdrawal.service.interface";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { ServiceError } from "../core/errors/service.error";
import mongoose, { Types } from "mongoose";
import { WalletOwnerType } from "../models/wallet.model";
import appConfig from "../config/app.config";
import { NotificationType } from "../models/notification.model";
import { INotificationService } from "../core/interfaces/services/notification.service.interface";


@injectable()
export class WithdrawalService extends BaseService<IWithdrawal> implements IWithDrawalService {
    constructor(
        @inject(TYPES.WithdrawalRepository) private _withdrawalRepository: IWithdrawalRepository,
        @inject(TYPES.WalletRepository) private _walletRepository: IWalletRepository,
        @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    ) {
        super(_withdrawalRepository)
    }
    async requestWithdrawal(
        inspectorId: string,
        amount: number,
        method: WithdrawalMethod,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paymentDetails: any
    ): Promise<IWithdrawal> {
        const wallet = await this._walletRepository.findOne({ owner: inspectorId, ownerType: WalletOwnerType.INSPECTOR });


        if (!wallet || wallet.balance < amount) {
            throw new ServiceError('Insufficient balance');
        }

        if (amount < 1000) {
            throw new ServiceError('Minimum withdrawal amount is ₹1000');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create withdrawal request
            const withdrawal = await this._withdrawalRepository.create({
                inspector: new mongoose.Types.ObjectId(inspectorId),
                amount,
                withdrawalMethod: method,
                ...(method === WithdrawalMethod.BANK_TRANSFER && { bankDetails: paymentDetails }),
                ...(method === WithdrawalMethod.UPI && { upiId: paymentDetails.upiId }),
                status: WithdrawalStatus.PENDING,
                requestDate: new Date()
            });

            //notification to admin
            await this._notificationService.createAndSendNotification(
                appConfig.adminId,
                "Admin",
                NotificationType.SYSTEM,
                "Withdrawal Request",
                `${withdrawal.inspector} has requested a withdrawal of ₹${withdrawal.amount}`,
                {
                    userId: inspectorId
                }
            )

            // Lock amount in wallet
            await this._walletRepository.findOneAndUpdate(
                { _id: wallet._id },
                {
                    $inc: {
                        balance: -amount,
                        pendingBalance: amount
                    }
                }
            );

            await session.commitTransaction();

            return withdrawal
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof ServiceError) {
                throw error;
            }
            throw new ServiceError('Failed to process withdrawal request');
        } finally {
            session.endSession();
        }
    }


    async ProcessWithdrawal(withdrawalId: string, action: "approve" | "reject", remarks?: string): Promise<void> {
        const withdrawal = await this._withdrawalRepository.findById(new Types.ObjectId(withdrawalId))

        if (!withdrawal) {
            throw new ServiceError('Withdrawal request not forund')
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            if (action === 'approve') {
                await this._withdrawalRepository.findByIdAndUpdate(new Types.ObjectId(withdrawalId), {
                    status: WithdrawalStatus.APPROVED,
                    processedDate: new Date(),
                    remarks
                })

                await this._walletRepository.findOneAndUpdate({
                    owner: withdrawal.inspector,
                    ownerType: WalletOwnerType.INSPECTOR
                }, {
                    $inc: {
                        pendingBalance: -withdrawal.amount,
                        totalWithdrawn: withdrawal.amount
                    }
                })

                // Send notification to inspector
                await this._notificationService.createAndSendNotification(
                    withdrawal.inspector.toString(),
                    "Inspector",
                    NotificationType.SYSTEM,
                    "Withdrawal Approved",
                    `Your withdrawal request of ₹${withdrawal.amount} has been approved.`,
                    {
                        withdrawalId
                    }
                )
            } else {
                await this._withdrawalRepository.findOneAndUpdate(new Types.ObjectId(withdrawalId), {
                    status: WithdrawalStatus.REJECTED,
                    processedDate: new Date(),
                    rejectionReason: remarks
                })

                await this._walletRepository.findOneAndUpdate(
                    {
                        owner: withdrawal.inspector,
                        ownerType: WalletOwnerType.INSPECTOR
                    },
                    {
                        $inc: {
                            balance: withdrawal.amount,
                            pendingBalance: -withdrawal.amount
                        }
                    }
                );

                // Send notification to inspector
                await this._notificationService.createAndSendNotification(
                    withdrawal.inspector.toString(),
                    "Inspector",
                    NotificationType.SYSTEM,
                    "Withdrawal Rejected",
                    `Your withdrawal request of ₹${withdrawal.amount} has been rejected.`,
                    {
                        withdrawalId
                    }
                )
            }

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }

    async getInspectorWithdrawals(inspectorId: string): Promise<IWithdrawal[]> {
        try {
            if (!inspectorId) {
                throw new ServiceError('Inspector id Required to Proceed')
            }
            return await this._withdrawalRepository.getInspectorWithdrawals(inspectorId)
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspector Withdrawels: ${error.message}`);
            }
            throw error;
        }
    }

    async getPendingWithdrawals(): Promise<IWithdrawal[]> {
        try {
            return await this._withdrawalRepository.getPendingWithdrawals();
        } catch (error) {
            if (error instanceof Error) {
                throw new ServiceError(`Error getting inspector Withdrawels: ${error.message}`);
            }
            throw error;
        }
    }

}