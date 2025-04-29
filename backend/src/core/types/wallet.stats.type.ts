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
    totalPlatformEarnings: number;
    totalProfit: number;
    totalTransactions: number;
    recentTransactions: IWalletTransaction[];
    totalWithdrawals: number;
    totalWithdrawalAmount: number;
    pendingWithdrawalAmount: number;
    withdrawalStats: WithdrawalStats[];
    earningsStats: IAdminEarningsStats[];
}

export interface WithdrawalStats {
    id: string;
    user: string;
    amount: number;
    requestDate: string;
    status: string;
    method: string;
    accountDetails: string;
}

export interface IAdminEarningsStats {
    id: string;
    date: string;
    amount: number;
    type: string;
    source: string;
    description: string;
}

export interface IUserWalletStats {
    totalSpent: number;
    totalRefunds: number;
    walletBalance: number;
    pendingRefunds: number;
    recentTransactions: IWalletTransaction[];
    monthlyStats: UserMonthlyStats[];
}

export interface UserMonthlyStats {
    month: string;
    spent: number;
    refunds: number;
    transactionCount: number;
}