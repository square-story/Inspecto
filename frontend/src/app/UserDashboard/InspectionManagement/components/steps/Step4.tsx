// components/steps/Step4.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { TimeSlotMap } from "./Step3";

const Step4 = () => {
    const { getValues, control } = useFormContext();

    // Retrieve all form values collected so far
    const values = getValues();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review Your Booking Details</h2>

            {/* Display the summary of collected data */}
            <div className="border p-4 rounded">
                <p>
                    <strong>Vehicle:</strong> {values.vehicleId || "Not provided"}
                </p>
                <p>
                    <strong>Location:</strong> {values.location || "Not provided"}
                </p>
                <p>
                    <strong>Phone Number:</strong> {values.phone || "Not provided"}
                </p>
                <p>
                    <strong>Inspection Type:</strong> {values.inspectionType || "Not provided"}
                </p>
                <p>
                    <strong>Time Slot:</strong> {TimeSlotMap[values.slotNumber] || "Not provided"}
                </p>
                <p>
                    <strong>date Slot:</strong> {format(values.date, "PPPP") || "Not provided"}
                </p>
                {/* Add any additional fields as needed */}
            </div>

            {/* Confirmation checkbox to agree with the displayed details */}
            <FormField
                control={control}
                name="confirmAgreement"
                render={({ field, fieldState: { error } }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(checked)}
                            />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                            I confirm that the above details are correct and I agree to proceed to the payment section.
                        </FormLabel>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />
        </div>
    );
};

export default Step4;
