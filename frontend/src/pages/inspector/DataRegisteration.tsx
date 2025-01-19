import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { TagsInput } from "@/components/ui/tags-input";

// Validation schema
const formSchema = z.object({
    address: z.string().min(3, "Address must be at least 3 characters"),
    profile_image: z.string().min(1, "Profile image is required"),
    certificates: z.array(z.string()).min(1, "At least one certificate is required"),
    yearOfExp: z.number().min(1).max(50, "Experience must be between 1-50 years"),
    signature: z.string().min(1, "Signature is required"),
    specialization: z.array(z.string()).min(1, "At least one specialization is required"),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    avaliable_days: z.number().min(1).max(7, "Days must be between 1-7")
});

export default function InspectorForm() {
    const [profilePreview, setProfilePreview] = useState<string>("");
    const [certificatePreviews, setCertificatePreviews] = useState<string[]>([]);
    const [signaturePreview, setSignaturePreview] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            specialization: [],
            certificates: [],
            avaliable_days: 5
        }
    });

    const handleFileUpload = (file: File, setter: (url: string) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCertificateUpload = (files: FileList) => {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificatePreviews(prev => [...prev, reader.result as string]);
                form.setValue('certificates', [...form.getValues('certificates'), file.name]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeCertificate = (index: number) => {
        setCertificatePreviews(prev => prev.filter((_, i) => i !== index));
        form.setValue('certificates', form.getValues('certificates').filter((_, i) => i !== index));
    };

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        try {
            console.log(data);
            toast.success("Form submitted successfully!");
        } catch (error) {
            toast.error("Failed to submit form");
            console.log(error)
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Inspector Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Profile Image */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="profile_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Image</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col items-center gap-4">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) {
                                                                handleFileUpload(e.target.files[0], setProfilePreview);
                                                                field.onChange(e.target.files[0].name);
                                                            }
                                                        }}
                                                    />
                                                    {profilePreview && (
                                                        <img src={profilePreview} alt="Profile" className="w-32 h-32 object-cover rounded-full" />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Basic Information */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter your address" />
                                            </FormControl>
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
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                                    placeholder="Years of experience"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Time and Days */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="start_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="end_time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="avaliable_days"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Available Days</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="7"
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Certificates */}
                            <FormField
                                control={form.control}
                                name="certificates"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Certificates</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                <Input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    multiple
                                                    onChange={(e) => {
                                                        if (e.target.files?.length) {
                                                            handleCertificateUpload(e.target.files);
                                                        }
                                                    }}
                                                />
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {certificatePreviews.map((preview, index) => (
                                                        <div key={index} className="relative">
                                                            <img src={preview} alt={`Certificate ${index + 1}`} className="w-full h-40 object-cover rounded" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCertificate(index)}
                                                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Specialization */}
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
                                                placeholder="Add specializations"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Signature */}
                            <FormField
                                control={form.control}
                                name="signature"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Signature</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col items-center gap-4">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) {
                                                            handleFileUpload(e.target.files[0], setSignaturePreview);
                                                            field.onChange(e.target.files[0].name);
                                                        }
                                                    }}
                                                />
                                                {signaturePreview && (
                                                    <img src={signaturePreview} alt="Signature" className="w-64 h-32 object-contain border rounded" />
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}