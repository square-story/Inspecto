import { z } from "zod";

export const FileSchema = z.object({
    file: typeof window === 'undefined'
        ? z.any()
        : z.instanceof(File)
            .refine(file => file.size <= 9, "Max file size is 9MB")
            .refine(file => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported."),
    preview: z.string(),
    id: z.string(), // Add this
    name: z.string(), // Add this
    size: z.number(), // Add this
    type: z.string(), // Add this
});