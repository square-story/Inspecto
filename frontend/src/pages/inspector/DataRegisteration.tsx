import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    profile_image: z.string(),
    start_time: z.number().min(1).max(12),
    start_option: z.string(),
    end_time: z.number().min(1).max(12),
    end_option: z.string(),
    address: z.string().min(3),
    certificate: z.string(),
    yearOfExp: z.number().min(1).max(30),
    specialization: z.array(z.string()).nonempty("Please add at least one item"),
});

export default function DetailedForm() {
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            specialization: ["test"],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Professional Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Profile Image Section */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold">Profile Image</h3>
                                <FormField
                                    control={form.control}
                                    name="profile_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUploader
                                                    value={files}
                                                    onValueChange={(files) => {
                                                        setFiles(files);
                                                        field.onChange(files);
                                                    }}
                                                    dropzoneOptions={dropZoneConfig}
                                                    className="relative bg-background rounded-lg p-2"
                                                >
                                                    <FileInput
                                                        id="fileInput"
                                                        className="outline-dashed outline-1 outline-slate-500 hover:outline-slate-600 transition-all"
                                                    >
                                                        <div className="flex items-center justify-center flex-col p-6 w-full">
                                                            <CloudUpload className="text-gray-500 w-8 h-8 mb-2" />
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                SVG, PNG, JPG or GIF (Max 4MB)
                                                            </p>
                                                        </div>
                                                    </FileInput>
                                                    <FileUploaderContent>
                                                        {files?.map((file, i) => (
                                                            <FileUploaderItem key={i} index={i}>
                                                                <Paperclip className="h-4 w-4 stroke-current" />
                                                                <span className="text-sm">{file.name}</span>
                                                            </FileUploaderItem>
                                                        ))}
                                                    </FileUploaderContent>
                                                </FileUploader>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </section>

                            {/* Working Hours Section */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold">Working Hours</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="start_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Time</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="eg: 8"
                                                            type="number"
                                                            className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Enter hour (1-12)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="start_option"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Period</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select AM/PM" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="AM">AM</SelectItem>
                                                            <SelectItem value="PM">PM</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="end_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End Time</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="eg: 5"
                                                            type="number"
                                                            className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Enter hour (1-12)</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="end_option"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Period</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select AM/PM" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="AM">AM</SelectItem>
                                                            <SelectItem value="PM">PM</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Professional Details Section */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold">Professional Details</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your address"
                                                        type="text"
                                                        className="w-full"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Your current city of practice</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="yearOfExp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Years of Experience</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="eg: 2"
                                                        type="number"
                                                        className="w-full"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Total years of professional experience</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="specialization"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Specializations</FormLabel>
                                                    <FormControl>
                                                        <TagsInput
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            placeholder="Enter specializations and press Enter"
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Add your areas of expertise</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end pt-6">
                                <Button type="submit" className="w-full sm:w-auto">
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}