import axiosInstance from "@/api/axios";
import { AxiosResponse } from "axios";


interface UpdateStatusResponse {
    success: boolean;
    message: string;
    data?: {
        userId: string;
        status: boolean;
    };
}

export const AdminService = {
    getInspectors: async () => {
        return await axiosInstance.get('/admin/get-inspectors')
    },
    getUsers: async () => {
        return await axiosInstance.get('/admin/get-users')
    },
    inspectorApproval: async (inspectorId: string) => {
        return await axiosInstance.patch(`/inspector/approve/${inspectorId}`)
    },
    denyInspector: async (inspectorId: string, reason: string) => {
        return await axiosInstance.post(`/inspector/deny/${inspectorId}`, { reason });
    },
    blockInspector: async (inspectorId: string) => {
        return await axiosInstance.patch(`/inspector/block/${inspectorId}`)
    },
    updateUserStatus: async (userId: string): Promise<AxiosResponse<UpdateStatusResponse>> => {
        return await axiosInstance.patch(`/user/block/${userId}`)
    },
    adminDashboardStats: async () => {
        return (await axiosInstance.get('/admin/dashboard')).data
    }
}