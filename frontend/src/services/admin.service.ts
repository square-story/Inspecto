import axiosInstance from "@/api/axios";

export const AdminService = {
    getInspectors: async () => {
        return await axiosInstance.get('/admin/get-inspectors')
    },
    getUsers: async () => {
        return await axiosInstance.get('/admin/get-users')
    }
}