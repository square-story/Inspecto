import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IWallet, IWalletTransaction, Wallet, WalletOwnerType } from "../models/wallet.model";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { IAdminWalletStats, IWalletStats } from "../core/types/wallet.stats.type";
import { format, parseISO } from 'date-fns'

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
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
        const wallet = await this.model.findOne({
            ownerType: WalletOwnerType.ADMIN
        })

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        return {
            totalEarnings: wallet.balance
        }
    }
}