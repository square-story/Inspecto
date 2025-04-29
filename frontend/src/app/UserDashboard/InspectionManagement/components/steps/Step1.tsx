import { InspectionTypeCard } from '@/components/InspectionTypeCard';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { VehicleDetails } from '@/components/VehicleDetailsCard';
import { fetchVehicles } from "@/features/vehicle/vehicleSlice";
import { AppDispatch, RootState } from "@/store";
import { Info } from "lucide-react";
import { useEffect, useState } from 'react';
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import AddressAutocomplete from "../AddressAutocomplete";
import { featchActiveInspectionTypes } from '@/features/inspectionType/inspectionTypeSlice';
import { fetchAppointments } from '@/features/inspection/inspectionSlice';



const Step1 = () => {
    const { control, setValue, watch } = useFormContext();
    const locationValue = watch("location");
    const selectedVehicleId = watch("vehicleId");
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [isVehicleDetailsOpen, setIsVehicleDetailsOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);
    const inspectionTypes = useSelector((state: RootState) => state.inspectionType.activeInspectionTypes);
    const inspections = useSelector((state: RootState) => state.inspections.data);
    const loading = useSelector((state: RootState) => state.inspectionType.loading);

    const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);

    useEffect(() => {
        dispatch(fetchVehicles());
        dispatch(featchActiveInspectionTypes());
        dispatch(fetchAppointments());
    }, [dispatch]);

    const availableVehicles = vehicles.filter(vehicle => {
        const hasPendingInspection = inspections.some(
            inspection => inspection.vehicle._id === vehicle._id &&
                (inspection.status === "pending" || inspection.status === "confirmed")
        );
        // Only include vehicles that don't have pending inspections
        return !hasPendingInspection;
    });

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
                                    {availableVehicles.length > 0 ? (
                                        availableVehicles.map((vehicle) => (
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
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No vehicles available
                                        </div>
                                    )}
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
                        <div className="grid gap-4 mt-2">
                            {loading ? (
                                <div className="text-center py-4">Loading inspection types...</div>
                            ) : inspectionTypes.length === 0 ? (
                                <div className="text-center py-4">No inspection types available</div>
                            ) : (
                                inspectionTypes.map((type) => (
                                    <InspectionTypeCard
                                        key={type._id}
                                        type={type}
                                        selected={field.value === type._id}
                                        onSelect={(value) => field.onChange(value)}
                                    />
                                ))
                            )}
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