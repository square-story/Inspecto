import axiosInstance from "@/api/axios";
import { IAdminWalletStats, IUserWalletStats, IWalletStats, MonthlyStats, TransactionStats } from "@/types/wallet.stats";

export const WalletService = {
    getAdminWalletStats: async (): Promise<IAdminWalletStats> => {
        const response = await axiosInstance.get('/wallet/admin/stats');
        return response.data.response;
    },
    getAdminEarningsHistory: async (): Promise<TransactionStats> => {
        const response = await axiosInstance.get('/wallet/admin/earnings');
        return response.data;
    },
    getAdminMonthlyStats: async (): Promise<MonthlyStats[]> => {
        const response = await axiosInstance.get('/wallet/admin/monthly-stats');
        return response.data;
    },
    getInspctorWalletStats: async (): Promise<IWalletStats> => {
        try {
            const response = await axiosInstance.get('/wallet/inspector/stats');
            return response.data.response;
        } catch (error) {
            console.error('Error fetching inspection stats:', error);
            throw new Error('Failed to load inspection statistics. Please try again later.');
        }
    },
    getInspectorEarningsHistory: async (): Promise<TransactionStats> => {
        const response = await axiosInstance.get('/wallet/inspector/earnings');
        return response.data;
    },
    getInspectorMonthlyStats: async (): Promise<MonthlyStats[]> => {
        const response = await axiosInstance.get('/wallet/inspector/monthly-stats');
        return response.data;
    },
    getUserWalletStats: async (): Promise<IUserWalletStats> => {
        const response = await axiosInstance.get('/wallet/user/stats');
        return response.data.response;
    },
}