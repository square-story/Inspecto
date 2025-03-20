import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IWallet, IWalletTransaction, Wallet } from "../models/wallet.model";
import { IWalletRepository } from "../core/interfaces/repositories/wallet.repository.interface";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository{
    constructor() {
        super(Wallet);
    }
    async updateWalletBalance(inspectorId: string, amount: number): Promise<IWallet | null> {
        return await this.model.findOneAndUpdate({ inspectorId }, { $inc: { balance: amount } }, { new: true });
    }
    async updateWalletTransactions(inspectorId: string, transaction: IWalletTransaction): Promise<IWallet | null> {
        return await this.model.findOneAndUpdate({ inspectorId }, { $push: { transactions: transaction } }, { new: true });
    }
}