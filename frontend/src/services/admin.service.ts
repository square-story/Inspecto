import axiosInstance from "@/api/axios";

export const AdminService = {
    getInspector: async () => {
        return await axiosInstance.get('/admin/get-inspectors')
    }
}