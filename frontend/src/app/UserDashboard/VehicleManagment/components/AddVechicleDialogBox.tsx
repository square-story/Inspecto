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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { VehicleType, Transmission, addVehicle } from "@/features/vehicle/vehicleSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { format } from 'date-fns';
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import ProfileDrop from "@/components/ProfileDrop";

interface AddVehicleDialogProps {
    onSuccess?: () => void;
}

const addVehicleSchema = z.object({
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
    frontViewImage: z.string().optional(),
    rearViewImage: z.string().optional(),
    color: z.string().optional(),
});




const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({ onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const form = useForm<z.infer<typeof addVehicleSchema>>({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            make: "",
            vehicleModel: "",
            year: new Date().getFullYear(),
            type: VehicleType.SEDAN,
            registrationNumber: "",
            chassisNumber: "",
            fuelType: "petrol",
            transmission: Transmission.AUTOMATIC,
            insuranceExpiry: new Date(),
            lastInspectionDate: undefined,
            frontViewImage: "",
            rearViewImage: "",
            color: "",
        },
        mode:'onSubmit'
    });

    const handleFront = (url: string | null) => {
        form.setValue("frontViewImage", url || '');
    }

    const handleBack = (url: string | null) => {
        form.setValue('rearViewImage', url || "")
    }
    async function onSubmit(data: z.infer<typeof addVehicleSchema>) {
        try {
            setIsLoading(true);
            await dispatch(addVehicle(data)).unwrap();
            toast.success("Vehicle added successfully");
            onSuccess?.();
            form.reset();
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
        <Dialog onOpenChange={(isOpen) => !isOpen && form.reset()}>
            <DialogTrigger asChild>
                <Card className="w-72 flex flex-col items-center justify-center p-6 border-dashed border-2 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer text-center">
                    <PlusCircle className="w-10 h-10 mb-5" />
                    <Button>Add New Vehicle</Button>
                </Card>
            </DialogTrigger>
            <DialogContent className="w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>
                        Fill in the details of your new vehicle.
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
                                    <div className="flex flex-row gap-5">
                                        <ProfileDrop onImageUpload={handleFront} defaultImage={''} headerTitle="Front Image" />
                                        <ProfileDrop onImageUpload={handleBack} defaultImage={''} headerTitle="Rear Image" />
                                    </div>
                                </FormSection>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
                        {isLoading ? "Adding Vehicle..." : "Add Vehicle"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddVehicleDialog;
