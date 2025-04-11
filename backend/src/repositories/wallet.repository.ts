import { inject, injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IWallet, IWalletTransaction, Wallet, WalletOwnerType } from "../models/wallet.model";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { IAdminWalletStats, IWalletStats } from "../core/types/wallet.stats.type";
import { format, parseISO } from 'date-fns'
import { TYPES } from "../di/types";
import { IWithdrawalRepository } from "../core/interfaces/repositories/withdrawal.repository.interface";
import { IWithdrawal, WithdrawalStatus } from "../models/withdrawal.model";

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
        const [wallet, allWithdrawals] = await Promise.all([
            this.model.findOne({ ownerType: WalletOwnerType.ADMIN }),
            this._withdrawalRepository.find({})
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

        const withdrawalStats = allWithdrawals.map(w => ({
            id: w._id?.toString() as unknown as string || '',
            user: w.inspector.toString(),
            amount: w.amount,
            requestDate: w.requestDate.toISOString(),
            status: w.status,
            method: w.withdrawalMethod,
            accountDetails: w.bankDetails ?
                `${w.bankDetails.accountNumber}` :
                w.upiId || 'N/A'
        }));
        return {
            totalPlatformEarnings: (wallet?.balance ?? 0),
            totalProfit: wallet?.balance || 0,
            totalTransactions: wallet?.transactions?.length || 0,
            recentTransactions: wallet?.transactions?.slice(-5) || [],
            totalWithdrawals: allWithdrawals.length,
            totalWithdrawalAmount: allWithdrawals
                .filter(w => w.status === WithdrawalStatus.APPROVED)
                .reduce((sum, w) => sum + w.amount, 0),
            pendingWithdrawalAmount: pendingWithdrawals
                .reduce((sum, w) => sum + w.amount, 0),
            withdrawalStats,
            earningsStats
        }
    }
}