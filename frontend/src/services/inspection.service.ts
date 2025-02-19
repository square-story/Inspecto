import axiosInstance from "@/api/axios"
import { Inspection } from "@/features/inspection/types";

export const InspectionService = {
    getAvailableSlots: async (selectedInspector: string, selectedDate: Date): Promise<number[]> => {
        const response = await axiosInstance.get(`/inspections/available-slots/${selectedInspector}/${selectedDate}`)
        return response.data.slots;
    },
    getInspections: async (): Promise<Inspection | null> => {
        const response = await axiosInstance.get('/inspections')
        return response.data.inspections
    }
}