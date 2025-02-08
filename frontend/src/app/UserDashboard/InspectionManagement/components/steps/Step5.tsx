import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFormContext } from "react-hook-form"

const Step5 = () => {
    const { control } = useFormContext()
    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select an Payment</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value}>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="strip" id="strip" />
                                        <Label htmlFor="strip">Strip</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="paytm" id="paytm" />
                                        <Label htmlFor="paytm">Paytm</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    )
}

export default Step5