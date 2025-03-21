import { IWallet, IWalletTransaction } from "../../../models/wallet.model";
import { IWalletStats } from "../../types/wallet.stats.type";
import { IBaseRepository } from "./base/base.repository.interface";

export interface IWalletRepository extends IBaseRepository<IWallet> {
    updateWalletBalance(inspectorId: string, amount: number): Promise<IWallet | null>;
    updateWalletTransactions(inspectorId: string, transaction: IWalletTransaction): Promise<IWallet | null>;
    WalletStatsInspector(inspectorId: string): Promise<IWalletStats>;
}