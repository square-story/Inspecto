import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form";
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
    const availableInspectors = inspectors.filter(inspector => inspector.status === "APPROVED");
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
                                {availableInspectors.length > 0 ? (
                                    availableInspectors.map((inspector) => (
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


        </div>
    )
}

export default Step2