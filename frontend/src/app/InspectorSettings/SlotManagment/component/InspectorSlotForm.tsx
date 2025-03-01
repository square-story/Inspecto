import AvailabilityPicker from "@/components/AvailabilityPicker"
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { setInspector } from "@/features/inspector/inspectorSlice";
import { useInspectorDetails } from "@/hooks/useInspectorDetails";
import { inspectorService } from "@/services/inspector.service";
import { AppDispatch } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";





const availabilityFormSchema = z.object({
    availableSlots: z.object({
        Monday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }),
        Tuesday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }),
        Wednesday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }),
        Thursday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }),
        Friday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }),
        Saturday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }),
        Sunday: z.object({
            enabled: z.boolean(),
            slots: z.number().min(0).max(10),
        }).optional(),
    }),
})



export type SlotFormValues = z.infer<typeof availabilityFormSchema>;

export default function InspectorSlotForm() {
    const { inspector, loading } = useInspectorDetails()
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<SlotFormValues>({
        resolver: zodResolver(availabilityFormSchema),
        defaultValues: {
            availableSlots: inspector.availableSlots
        },
    })

    async function onSubmit(data: SlotFormValues) {
        try {
            const updatedInspector = await inspectorService.updateInspector(data);
            dispatch(setInspector(updatedInspector.data.inspector))
            toast.success('Profile updated successfully!');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to update profile")
        }
    }
    if (loading) return (<LoadingSpinner />)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name="availableSlots"
                    render={({ field, fieldState: { error } }) => (
                        <FormItem>
                            <FormLabel>Available Slots</FormLabel>
                            <FormControl>
                                <AvailabilityPicker
                                    value={field.value || inspector.availableSlots}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Set your available slots for booking (for each day).
                            </FormDescription>
                            <FormMessage>{error && error.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <Button type='submit'>Update profile</Button>
            </form>
        </Form>
    )
}