import { useRef, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { inspectorService } from "@/services/inspector.service";
import { SpecializationSelect } from "@/components/fancy-multi-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddressAutocomplete from "@/app/UserDashboard/InspectionManagement/components/AddressAutocomplete";
import MinimalAvailabilityPicker from "@/components/minimal-availability-picker";
import { SimpleSignature, SimpleSignatureRef } from "@/components/ui/react-signature";
import { dataURLtoFile } from "@/helper/dataToFile";
import CropImage from "@/components/ui/cropper-image";
import CameraUploadComponent from "@/components/certificate-upload-component";


const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];



const FileSchema = z.object({
  file: typeof window === 'undefined'
    ? z.any()
    : z.instanceof(File)
      .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
      .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported."),
  preview: z.string(),
  id: z.string(), // Add this
  name: z.string(), // Add this
  size: z.number(), // Add this
  type: z.string(), // Add this
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

// Updated validation schema - signature is now a string (SVG)
const formSchema = z.object({
  location: z.string().min(3, "Address must be at least 3 characters"),
  profile_image: z.string().min(1, "Profile image is required"),
  certificates: z.array(FileSchema).min(1, "At least One Certificate is required"),
  yearOfExp: z.coerce.number()
    .min(1, "Experience must be at least 1 year")
    .max(50, "Experience must not exceed 50 years"),
  signature: z.string().min(1, "Signature is required"),
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
  file: File;
  preview: string;
  id: string;
  name: string;
  size: number;
  type: string;
}



export default function InspectorForm() {
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignatureValid, setIsSignatureValid] = useState(false);
  const navigate = useNavigate();

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
      profile_image: '',
      signature: "",
      availableSlots: defaultAvailability,
      unavailabilityPeriods: []
    }
  });

  const locationValue = form.watch("location");
  const signatureRef = useRef<SimpleSignatureRef>(null);

  const handleSignatureChange = (signature: string | null) => {
    const isEmpty = signatureRef.current?.isEmpty() ?? true;
    setIsSignatureValid(!!signature && !isEmpty);

    // Update form value with data URL
    form.setValue('signature', signature || '', { shouldValidate: true });
  };

  const uploadFiles = async () => {
    setIsUploadingFiles(true);
    try {
      const signatureDataURL = form.getValues('signature');
      const certificates = form.getValues('certificates');

      // Convert SVG string to file for upload
      const signaturePublicId = signatureDataURL
        ? await uploadToCloudinary(dataURLtoFile(signatureDataURL))
        : '';

      const certificatePublicIds = await Promise.all(
        certificates.map(async cert => await uploadToCloudinary(cert.file))
      );

      return {
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
    // Validate signature before submission
    if (!isSignatureValid || !data.signature) {
      toast.error("Please provide your signature");
      return;
    }

    try {
      setIsSubmitting(true);
      const { signatureUrl, certificateUrls } = await uploadFiles();
      const submitData = {
        address: data.location,
        profile_image: data.profile_image,
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
              <FormField
                control={form.control}
                name="profile_image"
                render={() => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <CropImage
                        onImageUpload={(url) => {
                          form.setValue('profile_image', url || '', { shouldValidate: true });
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a clear profile picture (Max size: 5MB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Certificates</FormLabel>
                    <FormControl>
                      <CameraUploadComponent
                        onFilesChange={(files) => {
                          const convertedFiles: FileWithPreview[] = files.map(fileObj => ({
                            file: fileObj.file,
                            preview: fileObj.preview,
                            id: fileObj.id,
                            name: fileObj.name,
                            size: fileObj.size,
                            type: fileObj.type
                          }));

                          field.onChange(convertedFiles);
                        }}
                        maxFileSize={MAX_FILE_SIZE}
                        acceptedTypes={ACCEPTED_DOCUMENT_TYPES}
                        maxFiles={10}
                        className="border-2 border-dashed border-gray-200 rounded-lg p-4"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your certificates using camera or file selection. Accepted formats: JPG, PNG, WEBP, PDF (max 5MB each, up to 10 files).
                    </FormDescription>
                    <FormMessage>{error && error.message}</FormMessage>
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

              {/* Signature - Updated to use FormSignature component */}
              <FormField
                control={form.control}
                name="signature"
                render={({ fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Digital Signature *</FormLabel>
                    <FormControl>
                      <SimpleSignature
                        ref={signatureRef}
                        onSignatureChange={handleSignatureChange}
                        placeholder="Please sign here"
                        width={400}
                        height={150}
                      />
                    </FormControl>
                    <FormMessage>{error && error.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isUploadingFiles || !isSignatureValid}
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