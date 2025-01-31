import axiosInstance from "@/api/axios";
import { InspectorState } from "@/features/inspector/inspectorSlice";

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
    }
}