import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { InspectionService } from '@/services/inspection.service';
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

// eslint-disable-next-line react-refresh/only-export-components
export const TimeSlotMap: Record<number, string> = {
    1: "8:00 AM",
    2: "9:00 AM",
    3: "10:00 AM",
    4: "11:00 AM",
    5: "12:00 PM",
    6: "1:00 PM",
    7: "2:00 PM",
    8: "3:00 PM",
    9: "4:00 PM",
    10: "5:00 PM"
};

export default function Step3() {
    const { control, watch, formState: { errors } } = useFormContext();
    const [availableSlots, setAvailableSlots] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const selectedDate = watch('date');
    const selectedInspector = watch('inspectorId');

    useEffect(() => {
        async function fetchAvailableSlots() {
            if (!selectedDate || !selectedInspector) return;

            setIsLoading(true);
            setError(null);
            try {
                const slots = await InspectionService.getAvailableSlots(
                    selectedInspector,
                    selectedDate
                );
                setAvailableSlots(slots);
            } catch (error) {
                setError('Unable to fetch available time slots. Please try again.');
                console.error('Error fetching slots:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAvailableSlots();
    }, [selectedDate, selectedInspector]);

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Inspection Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={errors.date ? "destructive" : "outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "EEEE, MMMM d, yyyy")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date <= new Date() ||
                                        date.getDay() === 0 ||
                                        date.getDay() === 6
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {selectedDate && (
                <FormField
                    control={control}
                    name="slotNumber"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Available Time Slots</FormLabel>
                            {isLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : error ? (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            ) : availableSlots.length === 0 ? (
                                <Alert>
                                    <AlertDescription>
                                        No time slots available for this date. Please select a different date.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
                                    >
                                        {availableSlots.map((slot) => (
                                            <div key={slot} className="space-y-2">
                                                <RadioGroupItem
                                                    value={slot.toString()}
                                                    id={`slot-${slot}`}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={`slot-${slot}`}
                                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                                >
                                                    <Clock className="mb-2 h-6 w-6" />
                                                    <span className="font-medium">{TimeSlotMap[slot]}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">Time will fluctuate with situation.</p>
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
}