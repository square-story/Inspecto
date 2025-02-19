import { useEffect, useState } from 'react';
import { useFormContext } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import AddressAutocomplete from "../AddressAutocomplete";
import { PhoneInput } from "@/components/ui/phone-input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchVehicles } from "@/features/vehicle/vehicleSlice";
import { INSPECTION_TYPE, InspectionTypeCard } from '@/components/InspectionTypeCard';
import { VehicleDetails } from '@/components/VehicleDetailsCard';






const INSPECTION_TYPES: INSPECTION_TYPE[] = [
    {
        id: 'basic',
        name: 'Basic Inspection',
        price: 200,
        platformFee: 50,
        duration: '45-60 mins',
        features: [
            'External visual inspection',
            'Basic engine diagnostics',
            'Tire condition check',
            'Brake system check'
        ]
    },
    {
        id: 'full',
        name: 'Full Inspection',
        price: 250,
        platformFee: 50,
        duration: '90-120 mins',
        features: [
            'Complete external & internal inspection',
            'Advanced computer diagnostics',
            'Suspension system check',
            'Electrical systems check',
            'Test drive evaluation',
            'Detailed report with photos'
        ]
    }
];







const Step1 = () => {
    const { control, setValue, watch } = useFormContext();
    const locationValue = watch("location");
    const selectedVehicleId = watch("vehicleId");
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [isVehicleDetailsOpen, setIsVehicleDetailsOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);

    const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);

    useEffect(() => {
        dispatch(fetchVehicles());
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="vehicleId"
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Vehicle</FormLabel>
                        <div className="space-y-2">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-20">
                                        <SelectValue placeholder="Select a vehicle" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-72">
                                    {vehicles.map((vehicle) => (
                                        <SelectItem key={vehicle._id} value={vehicle._id}>
                                            <div className="flex flex-col gap-2 text-start">
                                                <span className="font-medium">
                                                    {vehicle.make} ({vehicle.vehicleModel})
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {vehicle.registrationNumber || "N/A"}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedVehicle && (
                                <Dialog open={isVehicleDetailsOpen} onOpenChange={setIsVehicleDetailsOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                        >
                                            <Info className="w-4 h-4 mr-2" />
                                            View Vehicle Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Vehicle Details</DialogTitle>
                                        </DialogHeader>
                                        <VehicleDetails vehicle={selectedVehicle} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="location"
                render={({ fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        {locationValue || "Select a location"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Choose a Location</DialogTitle>
                                        <DialogDescription>
                                            Enter your address for the vehicle inspection
                                        </DialogDescription>
                                    </DialogHeader>
                                    <AddressAutocomplete
                                        setValue={setValue}
                                        closeDialog={() => setIsLocationDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </FormControl>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <PhoneInput {...field} defaultCountry="IN" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="inspectionType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Inspection Type</FormLabel>
                        <div className="grid gap-4 mt-2 ">
                            {INSPECTION_TYPES.map((type) => (
                                <InspectionTypeCard
                                    key={type.id}
                                    type={type}
                                    selected={field.value === type.id}
                                    onSelect={(value) => field.onChange(value)}
                                />
                            ))}
                        </div>
                    </FormItem>
                )}
            />

            <input type="hidden" {...control.register("latitude")} />
            <input type="hidden" {...control.register("longitude")} />
        </div>
    );
};

export default Step1;