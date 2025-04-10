import { IWalletTransaction } from "../../models/wallet.model";

export interface IWalletStats {
    totalEarnings: number;
    totalPlatformFee: number;
    totalTransactions: number;
    recentTransactions: IWalletTransaction[];
    pendingBalance: number;
    availableBalance: number;
}