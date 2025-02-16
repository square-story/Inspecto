import axiosInstance from "@/api/axios"

export const InspectionService = {
    getAvailableSlots: async (selectedInspector: string, selectedDate: Date): Promise<number[]> => {
        const response = await axiosInstance.get(`/inspections/available-slots/${selectedInspector}/${selectedDate}`)
        return response.data.slots;
    }
}