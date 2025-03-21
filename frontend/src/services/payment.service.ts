import axiosInstance from "@/api/axios"
import { IPayments } from "@/features/payments/types"
import { IWalletStats } from "@/types/inspector.wallet.stats"

export const PaymentService = {
    getPayments: async (): Promise<IPayments | null> => {
        const response = await axiosInstance.get('/payments')
        return response.data.payments
    },
    getStats: async (): Promise<IWalletStats | undefined> => {
        try {
            const response = await axiosInstance.get('/payments/get-stats');
            return response.data.response;
        } catch (error) {
            console.error('Error fetching inspection stats:', error);
            throw new Error('Failed to load inspection statistics. Please try again later.');
        }
    }
}