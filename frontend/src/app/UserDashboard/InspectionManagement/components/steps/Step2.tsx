import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { inspectorService } from "@/services/inspector.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inspectors } from "@/app/InspectorManagment/columns";
const Step2 = () => {
    const { control, watch } = useFormContext();
    const latitude = watch("latitude");
    const longitude = watch("longitude");

    const [inspectors, setInspectors] = useState<Inspectors[]>([]);
    useEffect(() => {
        async function fetchInspectors() {
            if (latitude && longitude) {
                const response = await inspectorService.getInspectorsBasedOnLocation(latitude, longitude)
                setInspectors(response.data)
            }
        }
        fetchInspectors();
    }, [latitude, longitude]);
    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="inspectorId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Choose Inspector</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an inspector" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {inspectors.length > 0 ? (
                                    inspectors.map((inspector) => (
                                        <SelectItem key={inspector._id} value={inspector._id}>
                                            {inspector.firstName} {inspector.lastName} ({inspector.specialization?.join(", ") || "No specialization"})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-inspectors">No inspectors available</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Slot Booking</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Your date of slot is used to calculate your slot.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default Step2