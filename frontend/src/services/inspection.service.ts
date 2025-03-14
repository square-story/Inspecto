import axiosInstance from "@/api/axios"
import { Inspection } from "@/features/inspection/types";
import { IInspectionStats } from "@/types/inspector.dashboard.stats";

export const InspectionService = {
    getAvailableSlots: async (selectedInspector: string, selectedDate: Date): Promise<number[]> => {
        const response = await axiosInstance.get(`/inspections/available-slots/${selectedInspector}/${selectedDate}`)
        return response.data.slots;
    },
    getInspections: async (): Promise<Inspection | null> => {
        const response = await axiosInstance.get('/inspections')
        return response.data.inspections
    },
    getStats: async (): Promise<IInspectionStats | undefined> => {
        try {
            const response = await axiosInstance.get('/inspections/get-stats');
            return response.data.response;
        } catch (error) {
            console.error('Error fetching inspection stats:', error);
            throw new Error('Failed to load inspection statistics. Please try again later.');
        }
    }
}

