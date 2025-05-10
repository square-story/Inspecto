import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { featchActiveInspectionTypes } from "@/features/inspectionType/inspectionTypeSlice";
import { AppDispatch, RootState } from "@/store";
import { format } from "date-fns";
import { Calendar, Car, CheckCircle, Clock, LucideWallet, MapPin, Phone, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface ReviewSectionProps {
    label: string;
    value: string | null;
    icon: React.ComponentType<{ className?: string }>;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
        <div className="mt-1">
            <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-semibold text-gray-900">{value || "Not provided"}</p>
        </div>
    </div>
);

const Step4 = () => {
    const { getValues, control } = useFormContext();
    const values = getValues();
    const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);
    const dispatch = useDispatch<AppDispatch>();
    const inspectionTypes = useSelector((state: RootState) => state.inspectionType.activeInspectionTypes);

    const selectedVehicle = vehicles.find(v => v._id === values.vehicleId);
    useEffect(()=>{
        dispatch(featchActiveInspectionTypes());
    },[dispatch])

    const selectedInspectionType = inspectionTypes.find(t => t._id === values.inspectionType);


    return (
        <div className="space-y-6">
            <Card className="w-full">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>Review Your Booking Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <ReviewSection
                            label="Vehicle"
                            value={selectedVehicle?.registrationNumber || "N/A"}
                            icon={Car}
                        />
                        <ReviewSection
                            label="Location"
                            value={values.location}
                            icon={MapPin}
                        />
                        <ReviewSection
                            label="Phone Number"
                            value={values.phone}
                            icon={Phone}
                        />
                        <ReviewSection
                            label="Inspection Type"
                            value={selectedInspectionType?.name || "N/A"}
                            icon={CheckCircle}
                        />
                        <ReviewSection
                            label="Date"
                            value={values.date ? format(values.date, "PPPP") : null}
                            icon={Calendar}
                        />
                        <ReviewSection
                            label="Time Slot"
                            value={JSON.parse(values.timeSlot).startTime + " - " + JSON.parse(values.timeSlot).endTime}
                            icon={Clock}
                        />
                        <ReviewSection
                            label="Platform Fee"
                            value={selectedInspectionType?.platformFee?.toString() || "N/A"}
                            icon={Wallet}
                        />
                        <ReviewSection
                            label="Inspector Fee"
                            value={selectedInspectionType?.price?.toString() || "N/A"}
                            icon={LucideWallet}
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <FormField
                            control={control}
                            name="confirmAgreement"
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className="flex flex-row items-start space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => field.onChange(checked)}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1">
                                        <FormLabel className="text-sm cursor-pointer">
                                            I confirm that the above details are correct and I agree to proceed to the payment section.
                                        </FormLabel>
                                        {error && (
                                            <FormMessage className="text-xs">
                                                {error.message}
                                            </FormMessage>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Step4;