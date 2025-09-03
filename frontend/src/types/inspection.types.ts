import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

export interface InspectionType {
    _id: string;
    name: string;
    price: number;
    platformFee: number;
    duration: string;
    features: string[];
    fields: Field[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const FIELD_TYPES = ["text", "number", "date", "select", "checkbox", "radio", "textarea"] as const

export const fieldSchema = z.object({
    label: z.string().min(1, "Label is required"),
    type: z.enum(FIELD_TYPES),
    required: z.boolean(),
    name: z.string().min(1, "Name is required"),
    options: z.array(z.string()).optional(), // Optional for non-select/radio fields
})

export type Field = z.infer<typeof fieldSchema>

export const inspectionTypeCreateSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(20, { message: "Name must not be longer than 20 characters." }),
    price: z.coerce.number().min(50, "Minimum value is 50").max(700, "Maximum value is 700"),
    platformFee: z.coerce.number().min(50, "Minimum value is 50").max(700, "Maximum value is 700"),
    duration: z.string().min(2, { message: "Duration must be at least 2 characters" }),
    features: z.array(z.string()).min(1, { message: "At least one feature is required" }),
    fields: z.array(fieldSchema).min(1, { message: "At least one field is required" }),
    isActive: z.boolean().default(true),
})

export type InspectionTypeCreateValues = z.infer<typeof inspectionTypeCreateSchema>

export const inspectionTypeEditSchema = inspectionTypeCreateSchema.omit({ name: true })

export type InspectionTypeEditValues = z.infer<typeof inspectionTypeEditSchema>

// ----------------------
// Props Interfaces
// ----------------------


export interface InspectionTypeFormProps {
    form: UseFormReturn<InspectionTypeCreateValues | InspectionTypeEditValues>
    isEdit?: boolean
}


export interface InspectionTypeDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    description: string
    form: UseFormReturn<InspectionTypeCreateValues | InspectionTypeEditValues>
    onSubmit: (values: InspectionTypeCreateValues | InspectionTypeEditValues) => void
    loading?: boolean
    isEdit?: boolean
}
export interface InspectionFieldsManagerProps {
    fields: Field[]
    onChange: (value: Field[]) => void
}
