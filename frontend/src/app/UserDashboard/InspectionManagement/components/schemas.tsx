import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const Step1Schema = z.object({
    vehicleId: z.string().min(1, "Vehicle selection is required"),
    location: z.string().min(1, "Location is required"),
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    inspectionType: z.string().min(1, "Select an inspection type").default("basic")
})


export const Step2Schema = z.object({
    inspectorId: z.string().min(1, "Select an inspector"),
    date: z.date({
        required_error: "A date of birth is required.",
    }),
})

export const Step3Schema = z.object({
    timeSlot: z.string().min(1, "Select a time slot")
})


export const Step4Schema = z.object({
    confirmAgreement: z.boolean().refine((val) => val === true, {
        message: "You must agree to proceed",
    }),
})


export const Step5Schema = z.object({
    paymentMethod: z.string().min(1, "Select a payment method")
})


export type Step1Data = z.infer<typeof Step1Schema>;
export type Step2Data = z.infer<typeof Step2Schema>;
export type Step3Data = z.infer<typeof Step3Schema>;
export type Step4Data = z.infer<typeof Step4Schema>;
export type Step5Data = z.infer<typeof Step5Schema>;