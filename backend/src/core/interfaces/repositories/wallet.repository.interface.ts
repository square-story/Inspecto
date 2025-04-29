import { IWallet, IWalletTransaction } from "../../../models/wallet.model";
import { BaseRepository } from "../../abstracts/base.repository";
import { IAdminWalletStats, IUserWalletStats, IWalletStats } from "../../types/wallet.stats.type";

export interface IWalletRepository extends BaseRepository<IWallet> {
    updateWalletBalance(inspectorId: string, amount: number): Promise<IWallet | null>;
    updateWalletTransactions(inspectorId: string, transaction: IWalletTransaction): Promise<IWallet | null>;
    WalletStatsInspector(inspectorId: string): Promise<IWalletStats>;
    WalletStatsAdmin(): Promise<IAdminWalletStats>;
    WalletStatsUser(userId: string): Promise<IUserWalletStats>;
    processRefundToUserWallet(userId: string, amount: number, reference: string, description: string): Promise<IWallet>;
}