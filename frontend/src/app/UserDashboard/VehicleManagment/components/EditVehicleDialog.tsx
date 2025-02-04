import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { VehicleType, Transmission, Vehicle, updateVehicle } from "@/features/vehicle/vehicleSlice";
import { format } from 'date-fns';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

interface EditVehicleDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: Vehicle;
}

const editVehicleSchema = z.object({
    make: z.string().min(2, { message: "Make must be at least 2 characters." }),
    vehicleModel: z.string().min(2, { message: "Model must be at least 2 characters." }),
    year: z.coerce.number().min(1900, { message: "Year must be valid." }),
    type: z.nativeEnum(VehicleType),
    registrationNumber: z.string().min(6, { message: "Registration number is required." }),
    chassisNumber: z.string().min(6, { message: "Chassis number is required." }),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
    transmission: z.nativeEnum(Transmission),
    insuranceExpiry: z.date().optional(),
    lastInspectionDate: z.date().optional(),
    frontViewImage: z.string().url().optional(),
    rearViewImage: z.string().url().optional(),
    color: z.string().optional(),
});

export const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
    isOpen,
    onOpenChange,
    vehicle,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm<z.infer<typeof editVehicleSchema>>({
        resolver: zodResolver(editVehicleSchema),
        defaultValues: {
            make: vehicle.make,
            vehicleModel: vehicle.vehicleModel,
            year: vehicle.year,
            type: vehicle.type,
            registrationNumber: vehicle.registrationNumber,
            chassisNumber: vehicle.chassisNumber,
            fuelType: vehicle.fuelType,
            transmission: vehicle.transmission,
            insuranceExpiry: vehicle.insuranceExpiry,
            lastInspectionDate: vehicle.lastInspectionDate,
            frontViewImage: vehicle.frontViewImage || "",
            rearViewImage: vehicle.rearViewImage || "",
            color: vehicle.color || "",
        },
    });

    async function onSubmit(data: z.infer<typeof editVehicleSchema>) {
        try {
            setIsLoading(true);
            const updatedVehicle = {
                ...data,
                _id: vehicle._id,
                insuranceExpiry: data.insuranceExpiry ?? new Date(), // Provide a default value if undefined
            };
            await dispatch(updateVehicle(updatedVehicle)).unwrap();
            toast.success("Vehicle updated successfully");
            onOpenChange(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error.status === 409) {
                // Duplicate key error
                const duplicateField = error.duplicateField || 'registrationNumber';

                // Set specific field error
                form.setError(duplicateField, {
                    type: 'manual',
                    message: error.error || `This ${duplicateField} is already in use`
                });

                // Optional: Show a toast for additional visibility
                toast.error(error.error || "Duplicate entry error");
            } else {
                // Handle other types of errors
                toast.error("An unexpected error occurred");
                console.error("Error in onSubmit:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {children}
        </div>
    );

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(isOpen) => {
                onOpenChange(isOpen);
                if (!isOpen) form.reset();
            }}
        >
            <DialogContent className="w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Vehicle Details</DialogTitle>
                    <DialogDescription>
                        Update the information for this vehicle.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <FormSection title="General Information">
                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Make</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Toyota" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="vehicleModel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Model</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Camry" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Color</FormLabel>
                                                <FormControl>
                                                    <Input type="color" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>

                                <FormSection title="Registration & Identification">
                                    <FormField
                                        control={form.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registration Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ABC 123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="chassisNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chassis Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1HGCM82633A123456" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vehicle Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Vehicle Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(VehicleType).map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>

                                <FormSection title="Technical Specifications">
                                    <FormField
                                        control={form.control}
                                        name="fuelType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fuel Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Fuel Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["petrol", "diesel", "electric", "hybrid"].map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="transmission"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Transmission</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Transmission" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(Transmission).map((transmission) => (
                                                            <SelectItem key={transmission} value={transmission}>
                                                                {transmission}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>

                                <FormSection title="Dates">
                                    <FormField
                                        control={form.control}
                                        name="insuranceExpiry"
                                        render={({ field }) => {
                                            // Convert the Date object to a string in the format YYYY-MM-DD
                                            const value = field.value ? format(field.value, 'yyyy-MM-dd') : '';
                                            return (
                                                <FormItem>
                                                    <FormLabel>Insurance Expiry</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            value={value}
                                                            onChange={(e) => {
                                                                // Convert the string back to a Date object
                                                                const date = e.target.value ? new Date(e.target.value) : null;
                                                                field.onChange(date);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastInspectionDate"
                                        render={({ field }) => {
                                            // Convert the Date object to a string in the format YYYY-MM-DD
                                            const value = field.value ? format(field.value, 'yyyy-MM-dd') : '';
                                            return (
                                                <FormItem>
                                                    <FormLabel>Last Inspection Date</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                            value={value}
                                                            onChange={(e) => {
                                                                // Convert the string back to a Date object
                                                                const date = e.target.value ? new Date(e.target.value) : null;
                                                                field.onChange(date);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </FormSection>

                                <FormSection title="Images">
                                    <FormField
                                        control={form.control}
                                        name="frontViewImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Front View Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/front.jpg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rearViewImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rear View Image URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/rear.jpg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
                        {isLoading ? "Updating Vehicle..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};