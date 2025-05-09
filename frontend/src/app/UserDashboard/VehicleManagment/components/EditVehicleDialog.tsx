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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import ProfileDrop from "@/components/ProfileDrop";

interface EditVehicleDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: Vehicle;
}

const editVehicleSchema = z.object({
    make: z.string().min(2, { message: "Make must be at least 2 characters." }),
    vehicleModel: z.string().min(2, { message: "Model must be at least 2 characters." }),
    year: z.coerce.number()
        .min(1900, { message: "Year must be valid." })
        .max(new Date().getFullYear() - 1, { message: "Year cannot be current or future year." }),
    type: z.nativeEnum(VehicleType),
    registrationNumber: z.string().min(6, { message: "Registration number is required." }),
    chassisNumber: z.string().min(6, { message: "Chassis number is required." }),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
    transmission: z.nativeEnum(Transmission),
    frontViewImage: z.string().optional(),
    rearViewImage: z.string().optional(),
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
            frontViewImage: vehicle.frontViewImage || "",
            rearViewImage: vehicle.rearViewImage || "",
        },
        mode: 'onSubmit'
    });

    const handleFront = (url: string | null) => {
        form.setValue("frontViewImage", url || '');
    }

    const handleBack = (url: string | null) => {
        form.setValue('rearViewImage', url || "")
    }

    async function onSubmit(data: z.infer<typeof editVehicleSchema>) {
        try {
            setIsLoading(true);
            const updatedVehicle = {
                ...data,
                _id: vehicle._id,
            } as Vehicle;

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

                                <FormSection title="Images">
                                    <div className="flex flex-row gap-5">
                                        <ProfileDrop onImageUpload={handleFront} defaultImage={vehicle.frontViewImage || ""} headerTitle="Front Image" />
                                        <ProfileDrop onImageUpload={handleBack} defaultImage={vehicle.rearViewImage || ""} headerTitle="Rear Image" />
                                    </div>
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
