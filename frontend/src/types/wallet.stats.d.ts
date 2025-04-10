export interface IWalletStats {
    totalEarnings: number;
    totalPlatformFee: number;
    totalTransactions: number;
    pendingBalance: number;
    availableBalance: number;
    monthlyStats: MonthlyStats[];
    recentTransactions: TransactionStats[];
}


export interface MonthlyStats {
    month: string;
    earnings: number;
    platformFee: number;
    transactionCount: number;
}

export interface TransactionStats {
    _id: string;
    amount: number;
    date: Date;
    type: string;
    status: string;
    reference: string;
    description: string;
}

export interface IAdminWalletStats {
    totalEarnings: number
}