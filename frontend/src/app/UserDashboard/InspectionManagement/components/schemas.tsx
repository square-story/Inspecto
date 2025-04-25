import { isValidPhoneNumber } from "react-phone-number-input";
import { string, z } from "zod";

export const Step1Schema = z.object({
    vehicleId: z.string().min(1, "Vehicle selection is required"),
    location: z.string().min(1, "Location is required"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    inspectionType: z.string().min(1, "Select an inspection type"),
})


export const Step2Schema = z.object({
    inspectorId: z.string().min(1, "Select an inspector"),
})

const timeSlotSchema = z.object({
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean(),
});

export const Step3Schema = z.object({
    date: z.date({
        required_error: "A date of slot is required.",
    }),
    timeSlot: string(),
})


export const Step4Schema = z.object({
    confirmAgreement: z.boolean().refine((val) => val === true, {
        message: "You must agree to proceed",
    }),
})





export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type Step3Data = z.infer<typeof Step3Schema>;
export type Step4Data = z.infer<typeof Step4Schema>;