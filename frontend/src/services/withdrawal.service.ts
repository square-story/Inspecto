import axiosInstance from "@/api/axios";



export const WithdrawalService = {
    async requestWithdrawal(
        amount: number,
        method: "BANK_TRANSFER" | "UPI",
        paymentDetails: { accountNumber: string; ifscCode?: string; accountHolderName: string; bankName: string; } | { upiId: string }
    ) {
        const response = await axiosInstance.post("/withdrawals/request", {
            amount,
            method,
            paymentDetails
        })
        return response.data
    },

    async getWithdrawalHistory() {
        const response = await axiosInstance.get("/withdrawals/history")
        return response.data
    }
}