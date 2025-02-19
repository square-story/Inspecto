import axiosInstance from "@/api/axios"
import { IPayments } from "@/features/payments/types"

export const PaymentService = {
    getPayments: async (): Promise<IPayments | null> => {
        const response = await axiosInstance.get('/payments')
        return response.data.payments
    }
}