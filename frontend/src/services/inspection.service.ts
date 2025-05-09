import axiosInstance from "@/api/axios"
import { TimeSlot } from "@/components/minimal-availability-picker";
import { Inspection } from "@/features/inspection/types";
import { InspectionFormValues } from "@/pages/inspector/InspectionReport";

export const InspectionService = {
    getAvailableSlots: async (selectedInspector: string, selectedDate: Date): Promise<TimeSlot[]> => {
        const response = await axiosInstance.get(`/inspections/available-slots/${selectedInspector}/${selectedDate}`)
        return response.data.slots;
    },
    getInspections: async (): Promise<Inspection | null> => {
        const response = await axiosInstance.get('/inspections')
        return response.data.inspections
    },
    submitInspectionReport: async (reportData: InspectionFormValues, id: string, isDraft: boolean): Promise<{ pdfUrl: string }> => {
        const response = await axiosInstance.post('/inspections/submit-report', { reportData, id, isDraft })
        return response.data
    }
}

