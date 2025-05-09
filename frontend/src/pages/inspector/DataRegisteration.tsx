import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { useForm, } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { inspectorService } from "@/services/inspector.service";
import { SpecializationSelect } from "@/components/fancy-multi-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddressAutocomplete from "@/app/UserDashboard/InspectionManagement/components/AddressAutocomplete";
import MinimalAvailabilityPicker from "@/components/minimal-availability-picker";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];

const FileSchema = z.object({
  file: typeof window === 'undefined'
    ? z.any()
    : z.instanceof(File)
      .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
      .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported."),
  preview: z.string()
});

const timeSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean()
});

const dayAvailabilitySchema = z.object({
  enabled: z.boolean(),
  slots: z.number().min(0).max(10),
  timeSlots: z.array(timeSlotSchema)
});

// Validation schema
const formSchema = z.object({
  location: z.string().min(3, "Address must be at least 3 characters"),
  profile_image: FileSchema.nullable(),
  certificates: z.array(FileSchema).min(1, "At least One Certificate is required"),
  yearOfExp: z.coerce.number()
    .min(1, "Experience must be at least 1 year")
    .max(50, "Experience must not exceed 50 years"),
  signature: FileSchema.nullable(),
  specialization: z.array(z.string()).min(1, "At least one specialization is required"),
  longitude: z.string().optional().nullable(),
  latitude: z.string().optional().nullable(),
  availableSlots: z.object({
    Monday: dayAvailabilitySchema,
    Tuesday: dayAvailabilitySchema,
    Wednesday: dayAvailabilitySchema,
    Thursday: dayAvailabilitySchema,
    Friday: dayAvailabilitySchema,
    Saturday: dayAvailabilitySchema,
  }),
  unavailabilityPeriods: z.array(
    z.object({
      id: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      reason: z.string(),
    })
  ),
});

interface FileWithPreview {
  file: File,
  preview: string
}


export default function InspectorForm() {
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultAvailability = {
    Monday: { enabled: false, slots: 0, timeSlots: [] },
    Tuesday: { enabled: false, slots: 0, timeSlots: [] },
    Wednesday: { enabled: false, slots: 0, timeSlots: [] },
    Thursday: { enabled: false, slots: 0, timeSlots: [] },
    Friday: { enabled: false, slots: 0, timeSlots: [] },
    Saturday: { enabled: false, slots: 0, timeSlots: [] },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialization: [],
      certificates: [],
      profile_image: null,
      signature: null,
      availableSlots: defaultAvailability,
      unavailabilityPeriods: []
    }
  });

  const locationValue = form.watch("location");

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) reject(new Error("No file provided"))

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        reject(new Error("Invalid file Type"))
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error("File too large"))
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })

  }

  const handleCertificateUpload = async (files: FileList) => {
    const currentCerts = form.getValues('certificates') || [];
    const newCerts: FileWithPreview[] = [];
    for (const file of Array.from(files)) {
      try {
        const preview = await handleFileUpload(file);
        newCerts.push({ file, preview });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to load ${file.name}: ${errorMessage}`);
      }
    }
    form.setValue('certificates', [...currentCerts, ...newCerts], { shouldValidate: true });
  }
  const removeCertificate = (index: number) => {
    const currentCerts = form.getValues('certificates');
    form.setValue('certificates',
      currentCerts.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const uploadFiles = async () => {
    setIsUploadingFiles(true);
    try {
      const profile = form.getValues('profile_image');
      const signature = form.getValues('signature');
      const certificates = form.getValues('certificates');

      const profilePublicId = profile ? await uploadToCloudinary(profile.file) : '';
      const signaturePublicId = signature ? await uploadToCloudinary(signature.file) : '';
      const certificatePublicIds = await Promise.all(
        certificates.map(async cert => await uploadToCloudinary(cert.file))
      );

      return {
        profileUrl: profilePublicId,
        signatureUrl: signaturePublicId,
        certificateUrls: certificatePublicIds
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('Failed to upload files');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const { profileUrl, signatureUrl, certificateUrls } = await uploadFiles();
      const submitData = {
        address: data.location,
        profile_image: profileUrl,
        signature: signatureUrl,
        certificates: certificateUrls,
        yearOfExp: data.yearOfExp,
        specialization: data.specialization,
        longitude: data.longitude,
        latitude: data.latitude,
        availableSlots: data.availableSlots
      };
      const response = await inspectorService.completeProfile(submitData)
      if (response.data) {
        toast.success("Profile updated successfully!");
        navigate('/inspector/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={async (e) => {
                              try {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const preview = await handleFileUpload(file);
                                  field.onChange({ file, preview });
                                }
                              } catch (error) {
                                toast.error(error instanceof Error ? error.message : 'Unknown error');
                              }
                            }}
                          />
                          {field.value?.preview && (
                            <img
                              src={field.value.preview}
                              alt="Profile"
                              className="w-32 h-32 object-cover rounded-full"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                              {locationValue ? locationValue : "Select a location"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg w-full space-y-4">
                            <DialogHeader>
                              <DialogTitle>Choose a Location</DialogTitle>
                            </DialogHeader>
                            <AddressAutocomplete setValue={form.setValue as (name: string, value: unknown) => void} closeDialog={() => setIsDialogOpen(false)} />
                          </DialogContent>
                        </Dialog>
                      </FormControl>
                      {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                  )}
                />

                <input type="hidden" {...form.control.register("latitude")} />
                <input type="hidden" {...form.control.register("longitude")} />

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
              <FormField
                control={form.control}
                name="availableSlots"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Available Slots</FormLabel>
                    <FormControl>
                      <MinimalAvailabilityPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Set your available slots for booking (for each day).
                    </FormDescription>
                    <FormMessage>{error && error.message}</FormMessage>
                  </FormItem>
                )}
              />




              {/* Certificates */}
              <FormField
                control={form.control}
                name="certificates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificates</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <Input
                            type="file"
                            accept={ACCEPTED_DOCUMENT_TYPES.join(',')}
                            multiple
                            onChange={async (e) => {
                              if (e.target.files?.length) {
                                // Validate total number of files
                                const currentFiles = field.value || [];
                                const newFilesCount = e.target.files.length;
                                const totalFiles = currentFiles.length + newFilesCount;

                                if (totalFiles > 10) {
                                  toast.error("Maximum 10 certificates allowed");
                                  return;
                                }

                                // Create loading toast
                                const loadingToast = toast.loading(
                                  `Processing ${e.target.files.length} certificate${e.target.files.length > 1 ? 's' : ''}...`
                                );

                                try {
                                  await handleCertificateUpload(e.target.files);
                                  toast.dismiss(loadingToast);
                                  toast.success("Certificates uploaded successfully");
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                } catch (error) {
                                  toast.dismiss(loadingToast);
                                  toast.error("Failed to upload certificates");
                                }
                              }
                            }}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-500">
                            Accepted formats: JPG, PNG, PDF (max 5MB each)
                          </p>
                        </div>

                        {/* Certificate Previews */}
                        {field.value?.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {field.value.map((cert, index) => (
                              <div key={index} className="relative group">
                                <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                                  {cert.file.type === 'application/pdf' ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                      <div className="text-center p-4">
                                        <svg
                                          className="mx-auto h-12 w-12 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                          />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500 truncate">
                                          {cert.file.name}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <img
                                      src={cert.preview}
                                      alt={`Certificate ${index + 1}`}
                                      className="object-cover w-full h-full"
                                    />
                                  )}
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                                  <div className="flex gap-2">
                                    {/* Preview Button */}
                                    <button
                                      type="button"
                                      onClick={() => window.open(cert.preview, '_blank')}
                                      className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors"
                                      title="Preview"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                      </svg>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        removeCertificate(index);
                                        toast.success("Certificate removed");
                                      }}
                                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                                      title="Remove"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>

                                {/* File Name */}
                                <p className="mt-1 text-sm text-gray-500 truncate">
                                  {cert.file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Empty State */}
                        {(!field.value || field.value.length === 0) && (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">
                                Upload your certificates
                              </p>
                            </div>
                          </div>
                        )}
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
                      <SpecializationSelect
                        value={field.value}
                        onChange={field.onChange}
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
                          accept={ACCEPTED_IMAGE_TYPES.join(',')}
                          onChange={async (e) => {
                            try {
                              const file = e.target.files?.[0];
                              if (file) {
                                const preview = await handleFileUpload(file);
                                field.onChange({ file, preview });
                              }
                            } catch (error) {
                              toast.error(error instanceof Error ? error.message : 'unknown error');
                            }
                          }}
                        />
                        {field.value?.preview && (
                          <img
                            src={field.value.preview}
                            alt="signature"
                            className="w-64 h-32 object-contain border rounded"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isUploadingFiles}
              >
                {(isSubmitting || isUploadingFiles) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploadingFiles ? "Uploading Files..." : "Updating Profile..."}
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
