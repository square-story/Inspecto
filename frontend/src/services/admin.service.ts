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
    getInspectors: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        isListed?: boolean;
    }) => {
        const { page = 1, limit = 10, search = '', isListed } = params || {};
        let url = `/admin/get-inspectors?page=${page}&limit=${limit}`;

        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        if (isListed !== undefined) {
            url += `&isListed=${isListed}`;
        }

        return await axiosInstance.get(url);
    },
    getUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) => {
        const { page = 1, limit = 10, search = '' } = params || {};
        let url = `/admin/get-users?page=${page}&limit=${limit}`;

        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        return await axiosInstance.get(url);
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