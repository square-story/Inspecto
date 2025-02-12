import axiosInstance from "@/api/axios"

export const InspectionService = {
    getAvailableSlots: async (selectedInspector: string, selectedDate: Date): Promise<number[]> => {
        const response = await axiosInstance.get(`/inspections/available-slots/${selectedInspector}/${selectedDate}`)
        console.log('Response:', response.data);
        return response.data.slots;
    }
}