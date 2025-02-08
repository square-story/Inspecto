
import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Step3 = () => {
    const { control } = useFormContext();

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="timeSlot"
                render={({ field, fieldState: { error } }) => (
                    <FormItem>
                        <FormLabel>Select a Time Slot</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value}>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="before-noon" id="time-before-noon" />
                                        <Label htmlFor="time-before-noon">Before Noon</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="after-noon" id="time-after-noon" />
                                        <Label htmlFor="time-after-noon">After Noon</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                )}
            />
        </div>
    );
};

export default Step3;
