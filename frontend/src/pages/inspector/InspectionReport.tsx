"use client"


import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { ArrowLeft, Save, Send } from "lucide-react"
import { Inspection } from "@/features/inspection/types"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useDropzone } from "react-dropzone"
import { uploadToCloudinary } from "@/utils/uploadToCloudinary"
import { useSignedImage } from "@/hooks/useSignedImage"
import { Skeleton } from "@/components/ui/skeleton"
import { InspectionService } from "@/services/inspection.service"
import { getSignedPdfUrl } from "@/utils/cloudinary"
import { saveAs } from "file-saver"


const inspectionFormSchema = z.object({
  mileage: z.string().min(1, "Mileage is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Mileage must be a positive number" }
  ),
  exteriorCondition: z.enum(["excellent", "good", "fair", "poor"]),
  interiorCondition: z.enum(["excellent", "good", "fair", "poor"]),
  engineCondition: z.enum(["excellent", "good", "fair", "poor"]),
  tiresCondition: z.enum(["excellent", "good", "fair", "poor"]),
  lightsCondition: z.enum(["excellent", "good", "fair", "poor"]),
  brakesCondition: z.enum(["excellent", "good", "fair", "poor"]),
  suspensionCondition: z.enum(["excellent", "good", "fair", "poor"]),
  fuelLevel: z.enum(["empty", "quarter", "half", "threequarters", "full"]),
  additionalNotes: z.string().optional(),
  recommendations: z.string().optional(),
  passedInspection: z.boolean().default(true),
  photos: z.array(z.string()).optional(),
})

export type InspectionFormValues = z.infer<typeof inspectionFormSchema>

export default function InspectionReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [inspection, setInspection] = useState<Inspection | null>(null)

  // Form state
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: {
      exteriorCondition: "good",
      interiorCondition: "good",
      engineCondition: "good",
      tiresCondition: "good",
      lightsCondition: "good",
      brakesCondition: "good",
      suspensionCondition: "good",
      fuelLevel: "half",
      additionalNotes: "",
      recommendations: "",
      passedInspection: true,
      mileage: "",
      photos: [],
    },
  })

  // Fetch inspection details
  useEffect(() => {
    const fetchInspectionDetails = async () => {
      try {
        // In a real app, you would fetch the inspection details from your API
        // For now, we'll use the data from the Redux store
        // Moved useSelector call outside the try block
        setLoading(false)
      } catch (error) {
        console.error("Error fetching inspection details:", error)
        toast.error("Failed to load inspection details. Please try again.")
      } finally {
        setLoading(false)

      }
    }

    if (id) {
      fetchInspectionDetails()
    }
  }, [id, navigate])

  // Fetch inspection data using useSelector outside the useEffect to avoid conditional hook call
  const { data } = useSelector((state: RootState) => state.inspections)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    async onDrop(files) {
      try {
        const currentPhotos = form.getValues("photos") || [];
        const newPhotos = await Promise.all(
          files.map(async (file) => {
            const publicId = await uploadToCloudinary(file);
            return publicId;
          })
        );
        form.setValue("photos", [...currentPhotos, ...newPhotos]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to upload photos. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (id) {
      const foundInspection = data.find((insp) => insp._id === id)

      if (foundInspection) {
        setInspection(foundInspection)
      } else {
        toast.error("The requested inspection could not be found.")
        navigate("/inspections")
      }
    }
  }, [id, navigate, data])

  const onSubmit = async (values: InspectionFormValues, isDraft = false) => {
    setSubmitting(true)

    try {
      const { pdfUrl } = await InspectionService.submitInspectionReport(values, id as string, isDraft);

      toast.success(isDraft
        ? "Your inspection report draft has been saved."
        : "Your inspection report has been submitted successfully.",
        {
          action: !isDraft && pdfUrl ? {
            label: 'Download Report',
            onClick: async () => {
              try {
                const signedUrl = await getSignedPdfUrl(pdfUrl);
                saveAs(signedUrl, 'inspection_report.pdf');
              } catch (error) {
                console.error('Error opening PDF:', error);
                toast.error('Unable to open PDF. Please try again later.');
              }
            }
          } : undefined,
        }
      )

      if (!isDraft) {
        navigate("/inspector/dashboard/inspection")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit the inspection report. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading inspection details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Inspections
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Inspection Report</CardTitle>
            <CardDescription>
              Complete the inspection report for booking reference: {inspection?.bookingReference}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))}>
              <CardContent>
                <div className="grid gap-6">
                  {/* Vehicle Information */}
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input id="registrationNumber" value={inspection?.vehicle?.registrationNumber || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="make">Make & Model</Label>
                        <Input
                          id="make"
                          value={`${inspection?.vehicle?.make || ""} ${inspection?.vehicle?.vehicleModel || ""}`}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" value={inspection?.vehicle?.year || ""} disabled />
                      </div>

                    </div>
                  </div>
                  <Separator />

                  {/* Inspection Details */}
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Inspection Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inspectionType">Inspection Type</Label>
                        <Input id="inspectionType" value={inspection?.inspectionType._id || ""} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inspectionDate">Inspection Date</Label>
                        <Input
                          id="inspectionDate"
                          value={inspection?.date ? format(new Date(inspection.date), "MM/dd/yyyy") : ""}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={inspection?.location || ""} disabled />
                      </div>
                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Mileage</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter current mileage"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Condition Assessment */}
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Condition Assessment</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="exteriorCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Exterior Condition</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="excellent" id="exterior-excellent" />
                                  <Label htmlFor="exterior-excellent">Excellent</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="good" id="exterior-good" />
                                  <Label htmlFor="exterior-good">Good</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="fair" id="exterior-fair" />
                                  <Label htmlFor="exterior-fair">Fair</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="poor" id="exterior-poor" />
                                  <Label htmlFor="exterior-poor">Poor</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="interiorCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Interior Condition</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="excellent" id="interior-excellent" />
                                  <Label htmlFor="interior-excellent">Excellent</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="good" id="interior-good" />
                                  <Label htmlFor="interior-good">Good</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="fair" id="interior-fair" />
                                  <Label htmlFor="interior-fair">Fair</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="poor" id="interior-poor" />
                                  <Label htmlFor="interior-poor">Poor</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="engineCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Engine Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tiresCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Tires Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lightsCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Light Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brakesCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Break Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="suspensionCondition"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Suspention Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fuelLevel"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Fuel Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="empty">Empty</SelectItem>
                                <SelectItem value="quarter">1/4</SelectItem>
                                <SelectItem value="half">1/2</SelectItem>
                                <SelectItem value="threequarters">3/4</SelectItem>
                                <SelectItem value="full">Full</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Notes and Recommendations */}
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Additional Notes</FormLabel>
                          <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            rows={4}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recommendations"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Recommedation Notes</FormLabel>
                          <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            rows={4}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passedInspection"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 pt-2">
                          <FormLabel>Vehicle passed inspection</FormLabel>
                          <Checkbox
                            id="passedInspection"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Photo Upload - In a real app, you would implement file upload functionality */}
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">Photos</h3>
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <input {...getInputProps()} />
                      <p className="text-muted-foreground">
                        {isDragActive ? "Drop photos here" : "Drag and drop photos here or click to upload"}
                      </p>
                      <Button variant="outline" className="mt-4" type="button">
                        Upload Photos
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {form.watch("photos")?.map((publicId) => (
                        <InspectionPhotoPreview key={publicId} publicId={publicId} />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    const values = form.getValues();
                    onSubmit(values, true);
                  }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save as Draft
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Submit Report
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}

function InspectionPhotoPreview({ publicId }: { publicId: string }) {
  const { imageUrl, isLoading } = useSignedImage(publicId);

  if (isLoading) return <Skeleton className="h-24 w-24 rounded-md" />;

  return (
    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
      <img
        src={imageUrl}
        alt="Inspection photo"
        className="object-cover w-full h-full"
      />
    </div>
  );
}
