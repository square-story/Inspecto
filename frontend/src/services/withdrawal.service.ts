import axiosInstance from "@/api/axios";



export const WithdrawalService = {
    async requestInspctorWithdrawal(
        amount: number,
        method: "BANK_TRANSFER" | "UPI",
        paymentDetails: { accountNumber: string; ifscCode?: string; accountHolderName: string; bankName: string; } | { upiId: string }
    ) {
        const response = await axiosInstance.post("/withdrawals/inspector/request", {
            amount,
            method,
            paymentDetails
        })
        return response.data
    },

    async getInspctorWithdrawalHistory() {
        const response = await axiosInstance.get("/withdrawals/inspector/history")
        return response.data.withdrawal
    },
    async getAllWithdrawalHistory() {
        const response = await axiosInstance.get("/withdrawals/admin/history")
        return response.data
    },
    async processWithdrawal(id: string, action: "approve" | "reject", remarks: string) {
        return await axiosInstance.post(`/withdrawals/admin/${id}/process`, { action, remarks });
    }
}