import { inject, injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IWallet, IWalletTransaction, TransactionStatus, TransactionType, Wallet, WalletOwnerType } from "../models/wallet.model";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { IAdminWalletStats, IUserWalletStats, IWalletStats } from "../core/types/wallet.stats.type";
import { format, parseISO } from 'date-fns'
import { TYPES } from "../di/types";
import { IWithdrawalRepository } from "../core/interfaces/repositories/withdrawal.repository.interface";
import { IWithdrawal, WithdrawalStatus } from "../models/withdrawal.model";
import mongoose from "mongoose";
import { earningData } from "../utils/earningsData";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor(
        @inject(TYPES.WithdrawalRepository) private _withdrawalRepository: IWithdrawalRepository
    ) {
        super(Wallet);
    }
    async updateWalletBalance(inspectorId: string, amount: number): Promise<IWallet | null> {
        return await this.model.findOneAndUpdate({ inspectorId }, { $inc: { balance: amount } }, { new: true });
    }
    async updateWalletTransactions(inspectorId: string, transaction: IWalletTransaction): Promise<IWallet | null> {
        return await this.model.findOneAndUpdate({ inspectorId }, { $push: { transactions: transaction } }, { new: true });
    }
    async WalletStatsInspector(inspectorId: string): Promise<IWalletStats> {
        const wallet = await this.model.findOne({
            owner: inspectorId,
            ownerType: WalletOwnerType.INSPECTOR
        })


        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const totalTransactions = wallet.transactions.length;
        const totalPlatformFee = totalTransactions * 50;
        const recentTransactions = wallet.transactions.slice(-5)
        const monthlyStatsMap: Record<string, { earnings: number; platformFee: number; transactionCount: number }> = {};

        wallet.transactions.forEach((transaction) => {
            const month = format(parseISO(transaction.date.toISOString()), "yyyy-MM") //format date as YYYY-MM
            if (!monthlyStatsMap[month]) {
                monthlyStatsMap[month] = { earnings: 0, platformFee: 0, transactionCount: 0 };
            }

            if (transaction.type === "EARNED") {
                monthlyStatsMap[month].earnings += transaction.amount;
            }

            monthlyStatsMap[month].platformFee += 50;
            monthlyStatsMap[month].transactionCount += 1;
        })

        const monthlyStats = Object.entries(monthlyStatsMap).map(([month, stats]) => ({
            month,
            ...stats
        }))

        return {
            totalEarnings: wallet.totalEarned,
            totalPlatformFee,
            totalTransactions,
            recentTransactions,
            pendingBalance: wallet.pendingBalance,
            availableBalance: wallet.balance,
            monthlyStats
        };
    }

    async WalletStatsAdmin(): Promise<IAdminWalletStats> {
        const [wallet, recentWithdrawals, allWithdrawalsCount, approvedWithdrawals] = await Promise.all([
            this.model.findOne({ ownerType: WalletOwnerType.ADMIN }),
            this._withdrawalRepository.find({})
                .then(withdrawals => {
                    const sorted = withdrawals.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime()).slice(0, 5);
                    return Promise.all(sorted.map(w => w.populate('inspector')));
                }),
            this._withdrawalRepository.find({}).then(w => w.length),
            this._withdrawalRepository.find({ status: WithdrawalStatus.APPROVED })
        ]);

        const pendingWithdrawals: IWithdrawal[] = await this._withdrawalRepository.getPendingWithdrawals();

        const earningsStats = wallet?.transactions?.map(t => ({
            id: t._id?.toString() as unknown as string || '',
            date: t.date.toISOString(),
            amount: t.amount,
            type: t.type,
            source: 'Platform Earnings',
            description: t.description || `Transaction for ${t.date.toISOString()}`
        })) || [];

        const fullWalletTransactions = (await this.model.find({})).map(wallet => wallet.transactions).flat();

        const withdrawalStats = recentWithdrawals.map(w => {
            const inspector = w.inspector as any;
            return {
                id: w._id?.toString() as unknown as string || '',
                user: w.inspector.toString(),
                inspectorName: inspector ? `${inspector.firstName} ${inspector.lastName}` : 'Unknown',
                amount: w.amount,
                requestDate: w.requestDate.toISOString(),
                status: w.status,
                method: w.withdrawalMethod,
                accountDetails: w.bankDetails ?
                    `${w.bankDetails.accountNumber}` :
                    w.upiId || 'N/A',
            };
        });
        return {
            totalPlatformEarnings: (wallet?.balance ?? 0),
            totalProfit: wallet?.balance || 0,
            totalTransactions: wallet?.transactions?.length || 0,
            recentTransactions: wallet?.transactions?.slice(-5) || [],
            totalWithdrawals: allWithdrawalsCount,
            totalWithdrawalAmount: approvedWithdrawals
                .reduce((sum, w) => sum + w.amount, 0),
            pendingWithdrawalAmount: pendingWithdrawals
                .reduce((sum, w) => sum + w.amount, 0),
            withdrawalStats,
            earningsStats,
            earningData: earningData(fullWalletTransactions)
        };
    }

    async WalletStatsUser(userId: string): Promise<IUserWalletStats> {
        const wallet = await this.model.findOne({ owner: userId, ownerType: WalletOwnerType.USER });

        if (!wallet) {
            return {
                totalSpent: 0,
                totalRefunds: 0,
                walletBalance: 0,
                pendingRefunds: 0,
                recentTransactions: [],
                monthlyStats: []
            };
        }

        const recentTransactions = wallet.transactions.slice(-5);

        let totalSpent = 0;
        let totalRefunds = 0;

        const monthlyStatsMap: Record<string, { spent: number; refunds: number; transactionCount: number }> = {};

        wallet.transactions.forEach((transaction) => {
            const month = format(parseISO(transaction.date.toISOString()), "yyyy-MM");

            if (!monthlyStatsMap[month]) {
                monthlyStatsMap[month] = { spent: 0, refunds: 0, transactionCount: 0 };
            }

            if (transaction.type === TransactionType.PAYMENT) {
                totalSpent += transaction.amount;
                monthlyStatsMap[month].spent += transaction.amount;
            } else if (transaction.type === "REFUND") {
                totalRefunds += transaction.amount;
                monthlyStatsMap[month].refunds += transaction.amount;
            }

            monthlyStatsMap[month].transactionCount += 1;
        });

        const monthlyStats = Object.entries(monthlyStatsMap).map(([month, stats]) => ({
            month,
            ...stats
        }));

        return {
            totalSpent,
            totalRefunds,
            walletBalance: wallet.balance,
            pendingRefunds: wallet.pendingBalance,
            recentTransactions,
            monthlyStats
        };
    }

    async processRefundToUserWallet(userId: string, amount: number, reference: string, description: string): Promise<IWallet> {
        let userWallet = await this.findOne({ owner: userId, ownerType: WalletOwnerType.USER })

        if (!userWallet) {
            userWallet = await this.model.create({
                owner: new mongoose.Types.ObjectId(userId),
                ownerType: WalletOwnerType.USER,
                balance: 0,
                pendingBalance: 0,
                totalEarned: 0,
                totalWithdrawn: 0,
                transactions: []
            });
        }

        const transaction: IWalletTransaction = {
            amount,
            date: new Date(),
            type: TransactionType.REFUND,
            status: TransactionStatus.COMPLETED,
            reference,
            description
        };

        return await this.findOneAndUpdate(
            { _id: userWallet._id },
            {
                $inc: { balance: amount },
                $push: { transactions: transaction }
            },
        );
    }
}