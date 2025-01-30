import axiosInstance from "@/api/axios";

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
    }
}