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