import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IWallet, IWalletTransaction, Wallet } from "../models/wallet.model";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";
import { IWalletStats } from "../core/types/wallet.stats.type";

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
        const wallet = await this.model.findOne({ inspector: inspectorId })
        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const totalTransactions = wallet.transactions.length;
        const totalPlatformFee = wallet.transactions
            .filter((transaction) => transaction.type == 'FEE')
            .reduce((sum, transaction) => sum + transaction.amount, 0)

        return {
            totalEarnings: wallet.balance,
            totalPlatformFee,
            totalTransactions,
        };
    }
}