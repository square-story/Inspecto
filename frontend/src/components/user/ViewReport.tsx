"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import {
    ArrowLeft,
    Calendar,
    Car,
    MapPin,
    Phone,
    FileText,
    User,
    CheckCircle2,
    XCircle,
    Fuel,
    Wrench,
} from "lucide-react"
import { useSignedImage } from "@/hooks/useSignedImage"

export default function UserReportPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const inspection = useSelector((state: RootState) => state.inspections.data.find((insp) => insp._id === id))

    if (!inspection) {
        return (
            <div className="container mx-auto py-16 px-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Inspection not found</h2>
                <p className="mb-8">The inspection report you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
            </div>
        )
    }

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case "excellent":
                return "bg-green-500"
            case "good":
                return "bg-emerald-400"
            case "fair":
                return "bg-amber-400"
            case "poor":
                return "bg-red-500"
            default:
                return "bg-gray-400"
        }
    }

    const getConditionPercentage = (condition: string) => {
        switch (condition) {
            case "excellent":
                return 100
            case "good":
                return 75
            case "fair":
                return 50
            case "poor":
                return 25
            default:
                return 0
        }
    }

    const getFuelLevelPercentage = (level: string) => {
        switch (level) {
            case "full":
                return 100
            case "threequarters":
                return 75
            case "half":
                return 50
            case "quarter":
                return 25
            case "empty":
                return 5
            default:
                return 0
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "completed":
                return "success"
            case "confirmed":
                return "info"
            case "pending":
                return "warning"
            case "cancelled":
                return "destructive"
            default:
                return "secondary"
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="flex items-center mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Inspection Report</h1>
                    <div className="text-sm text-muted-foreground">View detailed information about your vehicle inspection</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Summary */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Inspection Summary</CardTitle>
                            <Badge variant={getStatusBadgeVariant(inspection.status)} className="ml-auto">
                                {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center">
                                <Car className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">
                                        {inspection.vehicle.make} {inspection.vehicle.vehicleModel}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Vehicle</div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">{format(new Date(inspection.date), "MMMM dd, yyyy")}</div>
                                    <div className="text-xs text-muted-foreground">Inspection Date</div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">{inspection.bookingReference}</div>
                                    <div className="text-xs text-muted-foreground">Booking Reference</div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">{inspection.location}</div>
                                    <div className="text-xs text-muted-foreground">Location</div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">{inspection.phone}</div>
                                    <div className="text-xs text-muted-foreground">Contact Number</div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-3 text-muted-foreground" />
                                <div>
                                    <div className="text-sm font-medium">
                                        {inspection.inspector.firstName} {inspection.inspector.lastName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Inspector</div>
                                </div>
                            </div>

                            {inspection.report?.passedInspection !== undefined && (
                                <div className="flex items-center mt-4">
                                    {inspection.report.passedInspection ? (
                                        <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 mr-3 text-red-500" />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium">
                                            {inspection.report.passedInspection ? "Passed Inspection" : "Failed Inspection"}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => window.open(inspection.report?.reportPdfUrl, "_blank")}
                                disabled={!inspection.report?.reportPdfUrl}
                            >
                                <FileText className="mr-2 h-4 w-4" /> View Full PDF Report
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right column - Detailed Report */}
                <div className="lg:col-span-2">
                    {inspection.report ? (
                        <Tabs defaultValue="condition">
                            <TabsList className="grid grid-cols-3 mb-4">
                                <TabsTrigger value="condition">Condition</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="photos">Photos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="condition">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Vehicle Condition</CardTitle>
                                        <CardDescription>Assessment of your vehicle's condition across key areas</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Exterior</span>
                                                    <span className="text-sm font-medium capitalize">{inspection.report.exteriorCondition}</span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.exteriorCondition)}
                                                    className={getConditionColor(inspection.report.exteriorCondition)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Interior</span>
                                                    <span className="text-sm font-medium capitalize">{inspection.report.interiorCondition}</span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.interiorCondition)}
                                                    className={getConditionColor(inspection.report.interiorCondition)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Engine</span>
                                                    <span className="text-sm font-medium capitalize">{inspection.report.engineCondition}</span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.engineCondition)}
                                                    className={getConditionColor(inspection.report.engineCondition)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Tires</span>
                                                    <span className="text-sm font-medium capitalize">{inspection.report.tiresCondition}</span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.tiresCondition)}
                                                    className={getConditionColor(inspection.report.tiresCondition)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Lights</span>
                                                    <span className="text-sm font-medium capitalize">{inspection.report.lightsCondition}</span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.lightsCondition)}
                                                    className={getConditionColor(inspection.report.lightsCondition)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Brakes</span>
                                                    <span className="text-sm font-medium capitalize">{inspection.report.brakesCondition}</span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.brakesCondition)}
                                                    className={getConditionColor(inspection.report.brakesCondition)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">Suspension</span>
                                                    <span className="text-sm font-medium capitalize">
                                                        {inspection.report.suspensionCondition}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={getConditionPercentage(inspection.report.suspensionCondition)}
                                                    className={getConditionColor(inspection.report.suspensionCondition)}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <div className="flex items-center mb-2">
                                                <Fuel className="h-5 w-5 mr-2 text-muted-foreground" />
                                                <span className="text-sm font-medium">Fuel Level</span>
                                            </div>
                                            <Progress value={getFuelLevelPercentage(inspection.report.fuelLevel)} className="h-4" />
                                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                                <span>Empty</span>
                                                <span>1/4</span>
                                                <span>1/2</span>
                                                <span>3/4</span>
                                                <span>Full</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="details">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Inspection Details</CardTitle>
                                        <CardDescription>Additional information and recommendations</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2 flex items-center">
                                                <Wrench className="h-4 w-4 mr-2" /> Mileage
                                            </h3>
                                            <p className="text-sm">{inspection.report.mileage} miles</p>
                                        </div>

                                        {inspection.report.additionalNotes && (
                                            <div>
                                                <h3 className="text-sm font-semibold mb-2">Additional Notes</h3>
                                                <p className="text-sm bg-muted p-3 rounded-md">{inspection.report.additionalNotes}</p>
                                            </div>
                                        )}

                                        {inspection.report.recommendations && (
                                            <div>
                                                <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
                                                <p className="text-sm bg-muted p-3 rounded-md">{inspection.report.recommendations}</p>
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">Report Information</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Submitted:</span>{" "}
                                                    {inspection.report.submittedAt
                                                        ? format(new Date(inspection.report.submittedAt), "MMM dd, yyyy")
                                                        : "N/A"}
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Status:</span>{" "}
                                                    <span className="capitalize">{inspection.report.status}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Version:</span> {inspection.report.version}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="photos">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Inspection Photos</CardTitle>
                                        <CardDescription>Visual documentation of your vehicle's condition</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {inspection.report.photos && inspection.report.photos.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {inspection.report.photos.map((photo, index) => {
                                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                                    const { imageUrl, isLoading, error } = useSignedImage(photo, "none");

                                                    return (
                                                        <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                                                            {isLoading ? (
                                                                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                                                    <span>Loading...</span>
                                                                </div>
                                                            ) : error ? (
                                                                <div className="flex items-center justify-center w-full h-full bg-red-200">
                                                                    <span>Error loading image</span>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={imageUrl || "/placeholder.svg"}
                                                                    alt={`Inspection photo ${index + 1}`}
                                                                    className="object-cover w-full h-full"
                                                                    onClick={() => window.open(imageUrl, "_blank")}
                                                                />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>No photos available for this inspection</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Report Not Available</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    The detailed report for this inspection is not available yet. Please check back later.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
