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
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import { VehicleType, Transmission } from "@/features/vehicle/vehicleSlice";

const addVehicleSchema = z.object({
    make: z.string().min(2, { message: "Make must be at least 2 characters." }),
    vehicleModel: z.string().min(2, { message: "Model must be at least 2 characters." }),
    year: z.coerce.number().min(1900, { message: "Year must be valid." }),
    type: z.nativeEnum(VehicleType),
    registrationNumber: z.string().min(6, { message: "Registration number is required." }),
    chassisNumber: z.string().min(6, { message: "Chassis number is required." }),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
    transmission: z.nativeEnum(Transmission),
    insuranceExpiry: z.coerce.date(),
});

export default function AddVehicleDialog() {
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useIsMobile();

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
        },
    });

    async function onSubmit(data: z.infer<typeof addVehicleSchema>) {
        try {
            setIsLoading(true);
            toast.success(JSON.stringify(data));
            form.reset();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to add vehicle.");
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error("Error in onSubmit:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        form.reset();
    };

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6 sm:grid-cols-4">
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
                    <FormField
                        control={form.control}
                        name="insuranceExpiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Insurance Expiry</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} value={field.value.toISOString().split('T')[0]} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {isMobile ? (
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DrawerClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding Vehicle..." : "Add Vehicle"}
                        </Button>
                    </DrawerFooter>
                ) : (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding Vehicle..." : "Add Vehicle"}
                        </Button>
                    </DialogFooter>
                )}
            </form>
        </Form>
    );

    return (
        <>
            {isMobile ? (
                <Drawer onOpenChange={(isOpen) => !isOpen && handleClose()}>
                    <DrawerTrigger asChild>
                        <Button>Add New Vehicle</Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-4 w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                        <DrawerHeader>
                            <DrawerTitle>Add New Vehicle</DrawerTitle>
                            <DrawerDescription>
                                Fill in the details of your new vehicle.
                            </DrawerDescription>
                        </DrawerHeader>
                        {formContent}
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog onOpenChange={(isOpen) => !isOpen && handleClose()}>
                    <DialogTrigger asChild>
                        <Button>Add New Vehicle</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>Add New Vehicle</DialogTitle>
                            <DialogDescription>
                                Fill in the details of your new vehicle.
                            </DialogDescription>
                        </DialogHeader>
                        {formContent}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}