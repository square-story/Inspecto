"use client";

import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import AddressAutocomplete from "../AddressAutocomplete";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "@/features/vehicle/vehicleSlice";
import { PhoneInput } from "@/components/ui/phone-input";

const Step1 = () => {
    const { control, setValue, watch } = useFormContext();
    const locationValue = watch("location");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);


    const refreshVehicles = useCallback(() => {
        dispatch(fetchVehicles());
    }, [dispatch]);

    useEffect(() => {
        refreshVehicles();
    }, [refreshVehicles]);

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="vehicleId"
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Vehicle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-20" >
                                    <SelectValue placeholder="Select a vehicle" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-72 overflow-auto">
                                {vehicles.map((vehicle) => (
                                    <SelectItem key={vehicle._id} value={vehicle._id}>
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium">{vehicle.make} ({vehicle.vehicleModel})</span>
                                            <span className="text-sm text-gray-500">{vehicle.registrationNumber || "N/A"}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        {locationValue ? locationValue : "Select a location"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg w-full space-y-4">
                                    <DialogHeader>
                                        <DialogTitle>Choose a Location</DialogTitle>
                                    </DialogHeader>
                                    <AddressAutocomplete setValue={setValue} closeDialog={() => setIsDialogOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </FormControl>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />
            {/* Hidden fields to store latitude & longitude */}
            <input type="hidden" {...control.register("latitude")} />
            <input type="hidden" {...control.register("longitude")} />


            <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                    <FormItem className="grid gap-2">
                        <FormLabel htmlFor="phone">Phone Number</FormLabel>
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
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Inspection Type</FormLabel>
                        <FormControl>
                            <Select
                                defaultValue="basic"
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an Inspection type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic Inspection</SelectItem>
                                    <SelectItem value="full">Full Inspection</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />
        </div>
    );
};

export default Step1;