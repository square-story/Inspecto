import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InspectionTypeFormProps } from "@/types/inspection.types";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";
import { Input } from "@/components/ui/input";
import { InspectionFieldsManager } from "./InspectionFieldsManager";

export const InspectionTypeForm = ({ form, isEdit = false }: InspectionTypeFormProps) => {
    return (
        <Form {...form}>
            <div className="grid gap-4 py-2">
                {!isEdit && (
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Inspection Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Inspection Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="platformFee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Platform Fee (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 45-60 mins" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fields"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fields</FormLabel>
                            <FormControl>
                                <InspectionFieldsManager
                                    fields={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Features</FormLabel>
                            <FormControl>
                                <TagsInput
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    placeholder="Enter features..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!isEdit && (
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormLabel>Is Active</FormLabel>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </Form>
    )
}