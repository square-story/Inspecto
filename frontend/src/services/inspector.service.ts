import axiosInstance from "@/api/axios";
import { InspectorState } from "@/features/inspector/inspectorSlice";
import { passwordFormSchema } from "./user.service";

interface IsubmitData {
    address: string;
    profile_image: string;
    signature: string;
    certificates: string[];
    yearOfExp: number;
    specialization: string[];
    start_time: string;
    end_time: string;
    avaliable_days: number;
}



export const inspectorService = {
    completeProfile: async (userData: IsubmitData) => {
        return await axiosInstance.post('/inspector/complete-profile', userData)
    },
    getProfile: async () => {
        return await axiosInstance.get('/inspector/details')
    },
    updateInspector: async (data: Partial<InspectorState>) => {
        return await axiosInstance.put('/inspector/update', data)
    },
    changePassword: async (data: passwordFormSchema) => {
        return await axiosInstance.put('/inspector/change-password', data)
    },
    getInspectorsBasedOnLocation: async (latitude: string, longitude: string) => {
        return await axiosInstance.get(`/inspector?latitude=${latitude}&longitude=${longitude}`)
    }
}