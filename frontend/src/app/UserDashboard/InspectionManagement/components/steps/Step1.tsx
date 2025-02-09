"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import AddressAutocomplete from "../AddressAutocomplete";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Step1 = () => {
    const { control, setValue, watch } = useFormContext();
    const locationValue = watch("location");
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="vehicleId"
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Vehicle</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Vehicle ID" {...field} />
                        </FormControl>
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
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Phone Number" {...field} />
                        </FormControl>
                        {error && <FormMessage>{error.message}</FormMessage>}
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
                                <SelectTrigger className="w-full">
                                    {field.value === "basic"
                                        ? "Basic Inspection"
                                        : field.value === "full"
                                            ? "Full Inspection"
                                            : "Select an Inspection Type"}
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