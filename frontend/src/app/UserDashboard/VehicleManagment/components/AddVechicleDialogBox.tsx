import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { VehicleType, Transmission, addVehicle } from "@/features/vehicle/vehicleSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import ProfileDrop from "@/components/ProfileDrop";
import { isAxiosError } from "axios";

interface AddVehicleDialogProps {
    onSuccess?: () => void;
}

// Optimized schema with better validation messages
const addVehicleSchema = z.object({
    make: z.string()
        .min(1, { message: "Make is required" })
        .min(2, { message: "Make must be at least 2 characters" })
        .max(50, { message: "Make must be less than 50 characters" })
        .trim(),
    vehicleModel: z.string()
        .min(1, { message: "Model is required" })
        .min(2, { message: "Model must be at least 2 characters" })
        .max(50, { message: "Model must be less than 50 characters" })
        .trim(),
    year: z.coerce.number()
        .min(1900, { message: "Year must be 1900 or later" })
        .max(new Date().getFullYear(), { message: "Year cannot be in the future" })
        .int({ message: "Year must be a whole number" }),
    type: z.nativeEnum(VehicleType, {
        errorMap: () => ({ message: "Please select a valid vehicle type" })
    }),
    registrationNumber: z.string()
        .min(1, { message: "Registration number is required" })
        .min(3, { message: "Registration number must be at least 3 characters" })
        .max(20, { message: "Registration number must be less than 20 characters" })
        .trim()
        .regex(/^[A-Za-z0-9\s-]+$/, { message: "Registration number can only contain letters, numbers, spaces, and hyphens" }),
    chassisNumber: z.string()
        .min(1, { message: "Chassis number is required" })
        .min(8, { message: "Chassis number must be at least 8 characters" })
        .max(25, { message: "Chassis number must be less than 25 characters" })
        .trim()
        .regex(/^[A-Za-z0-9]+$/, { message: "Chassis number can only contain letters and numbers" }),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"], {
        errorMap: () => ({ message: "Please select a valid fuel type" })
    }),
    transmission: z.nativeEnum(Transmission, {
        errorMap: () => ({ message: "Please select a valid transmission type" })
    }),
    frontViewImage: z.string().optional(),
    rearViewImage: z.string().optional(),
});

type AddVehicleFormData = z.infer<typeof addVehicleSchema>;

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({ onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    // Memoize current year to prevent recalculation
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const form = useForm<AddVehicleFormData>({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            make: "",
            vehicleModel: "",
            year: currentYear,
            type: VehicleType.SEDAN,
            registrationNumber: "",
            chassisNumber: "",
            fuelType: "petrol",
            transmission: Transmission.AUTOMATIC,
            frontViewImage: "",
            rearViewImage: "",
        },
        mode: 'onBlur', // Changed from 'onSubmit' to 'onBlur' for better UX
        reValidateMode: 'onBlur', // Only revalidate on blur, not on change
    });

    // Memoize handlers to prevent unnecessary re-renders
    const handleFrontImage = useCallback((url: string | null) => {
        form.setValue("frontViewImage", url || '', { shouldDirty: true });
    }, [form]);

    const handleRearImage = useCallback((url: string | null) => {
        form.setValue('rearViewImage', url || "", { shouldDirty: true });
    }, [form]);

    const handleDialogOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset form when dialog closes
            form.reset();
        }
    }, [form]);

    const onSubmit = useCallback(async (data: AddVehicleFormData) => {
        try {
            setIsLoading(true);
            await dispatch(addVehicle(data)).unwrap();
            toast.success("Vehicle added successfully");
            onSuccess?.();
            form.reset();
            setIsOpen(false);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                if (error.response?.status === 409) {
                    const duplicateField = error.response.data.duplicateField || 'registrationNumber';
                    const errorMessage = error.response.data.error || `This ${duplicateField} is already in use`;

                    form.setError(duplicateField as keyof AddVehicleFormData, {
                        type: 'manual',
                        message: errorMessage
                    });

                    toast.error(errorMessage);
                } else {
                    const errorMessage = error?.message || "An unexpected error occurred";
                    toast.error(errorMessage);
                    console.error("Error adding vehicle:", error);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, onSuccess, form]);

    // Memoized form section component
    const FormSection = useMemo(() => ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {children}
        </div>
    ), []);

    // Memoize fuel type and vehicle type options
    const fuelTypeOptions = useMemo(() => ["petrol", "diesel", "electric", "hybrid"], []);
    const vehicleTypeOptions = useMemo(() => Object.values(VehicleType), []);
    const transmissionOptions = useMemo(() => Object.values(Transmission), []);

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <Card className="w-72 flex flex-col items-center justify-center p-6 border-dashed border-2 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer text-center">
                    <PlusCircle className="w-10 h-10 mb-5 text-gray-500" />
                    <Button variant="outline">Add New Vehicle</Button>
                </Card>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>
                        Fill in the details of your new vehicle. All fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* General Information Section */}
                                <FormSection title="General Information">
                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Make *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Toyota, Honda, Ford"
                                                        {...field}
                                                        autoComplete="off"
                                                    />
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
                                                <FormLabel>Model *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Camry, Civic, Focus"
                                                        {...field}
                                                        autoComplete="off"
                                                    />
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
                                                <FormLabel>Year *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder={currentYear.toString()}
                                                        min={1900}
                                                        max={currentYear}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>

                                {/* Registration & Identification Section */}
                                <FormSection title="Registration & Identification">
                                    <FormField
                                        control={form.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Registration Number *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. ABC-1234, XYZ 5678"
                                                        {...field}
                                                        autoComplete="off"
                                                        className="uppercase"
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    />
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
                                                <FormLabel>Chassis Number *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. 1HGCM82633A123456"
                                                        {...field}
                                                        autoComplete="off"
                                                        className="uppercase"
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    />
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
                                                <FormLabel>Vehicle Type *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select vehicle type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {vehicleTypeOptions.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type.charAt(0) + type.slice(1).toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>

                                {/* Technical Specifications Section */}
                                <FormSection title="Technical Specifications">
                                    <FormField
                                        control={form.control}
                                        name="fuelType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fuel Type *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select fuel type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {fuelTypeOptions.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type.charAt(0).toUpperCase() + type.slice(1)}
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
                                                <FormLabel>Transmission *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select transmission" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {transmissionOptions.map((transmission) => (
                                                            <SelectItem key={transmission} value={transmission}>
                                                                {transmission.charAt(0) + transmission.slice(1).toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </FormSection>
                            </div>

                            {/* Images Section - Full Width */}
                            <FormSection title="Vehicle Images (Optional)">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <ProfileDrop
                                            onImageUpload={handleFrontImage}
                                            defaultImage={''}
                                            headerTitle="Upload Front Image"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <ProfileDrop
                                            onImageUpload={handleRearImage}
                                            defaultImage={''}
                                            headerTitle="Upload Rear Image"
                                        />
                                    </div>
                                </div>
                            </FormSection>
                        </form>
                    </Form>
                </ScrollArea>

                <DialogFooter className="mt-6 gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isLoading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={isLoading || !form.formState.isValid}
                        onClick={form.handleSubmit(onSubmit)}
                        className="min-w-[120px]"
                    >
                        {isLoading ? "Adding..." : "Add Vehicle"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddVehicleDialog;