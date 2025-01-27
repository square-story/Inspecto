import axiosInstance from "@/api/axios";

export const AdminService = {
    getInspectors: async () => {
        return await axiosInstance.get('/admin/get-inspectors')
    }
}