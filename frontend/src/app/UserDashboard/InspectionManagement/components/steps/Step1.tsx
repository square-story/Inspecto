// components/steps/Step1.tsx
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

const Step1 = () => {
    const { control } = useFormContext();

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
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Location" {...field} />
                        </FormControl>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />

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
