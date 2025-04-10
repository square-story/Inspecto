import { IWalletTransaction } from "../../models/wallet.model";

export interface IWalletStats {
    totalEarnings: number;
    totalPlatformFee: number;
    totalTransactions: number;
    recentTransactions: IWalletTransaction[];
    pendingBalance: number;
    availableBalance: number;
    monthlyStats: MonthlyStats[];
}


export interface MonthlyStats {
    month: string;
    earnings: number;
    platformFee: number;
    transactionCount: number;
}


export interface IAdminWalletStats {
    totalEarnings: number;
}