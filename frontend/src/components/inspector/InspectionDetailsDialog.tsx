import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Car, User, FileText, Mail, Phone } from "lucide-react";
import { Inspection } from "@/features/inspection/types";

interface InspectionDetailsDialogProps {
    inspection: Inspection | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500",
    confirmed: "bg-blue-500/10 text-blue-500",
    completed: "bg-green-500/10 text-green-500",
    cancelled: "bg-red-500/10 text-red-500",
    payment_pending: "bg-orange-500/10 text-orange-500",
    payment_completed: "bg-emerald-500/10 text-emerald-500",
};

export default function InspectionDetailsDialog({
    inspection,
    open,
    onOpenChange,
}: InspectionDetailsDialogProps) {
    if (!inspection) return null;

    // Helper function to safely format date
    const safeFormatDate = (date: string | Date) => {
        try {
            return format(new Date(date), "PPP");
        } catch {
            return "Invalid date";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Inspection Details - {inspection.bookingReference || "No Reference"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-full pr-4">
                    <div className="grid gap-6">
                        {/* Status and Type Section */}
                        <div className="flex items-center justify-between">
                            <Badge
                                variant="secondary"
                                className={`text-sm ${statusColors[inspection.status as keyof typeof statusColors] || ""}`}
                            >
                                {(inspection.status || "unknown").replace("_", " ")}
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                {(inspection.inspectionType.name).toUpperCase()}
                            </Badge>
                        </div>

                        {/* User Details */}
                        {inspection.user && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Customer Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="font-medium">Name</div>
                                            <div className="text-sm text-muted-foreground">
                                                {`${inspection.user.firstName || ""} ${inspection.user.lastName || ""}`}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <div className="font-medium">Email</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {inspection.user.email || "Not specified"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                                            <div>
                                                <div className="font-medium">Contact</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {inspection.phone || "Not specified"}
                                                </div>
                                            </div>
                                        </div>
                                        {inspection.user.address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                                <div>
                                                    <div className="font-medium">Address</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {inspection.user.address}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Appointment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Appointment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                        <div>
                                            <div className="font-medium">Location</div>
                                            <div className="text-sm text-muted-foreground">
                                                {inspection.location || "Location not specified"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                                        <div>
                                            <div className="font-medium">Date & Time</div>
                                            <div className="text-sm text-muted-foreground">
                                                {inspection.date ? safeFormatDate(inspection.date) : "Date not specified"}
                                                <br />
                                                Slot {inspection.timeSlot.startTime + "-" + inspection.timeSlot.endTime|| "Not specified"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vehicle Details */}
                        {inspection.vehicle && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Car className="h-5 w-5" />
                                        Vehicle Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="font-medium">Registration Number</div>
                                            <div className="text-sm text-muted-foreground">
                                                {inspection.vehicle.registrationNumber || "Not specified"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Chassis Number</div>
                                            <div className="text-sm text-muted-foreground">
                                                {inspection.vehicle.chassisNumber || "Not specified"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Make & Model</div>
                                            <div className="text-sm text-muted-foreground">
                                                {`${inspection.vehicle.make || ""} ${inspection.vehicle.vehicleModel || ""} ${inspection.vehicle.year ? `(${inspection.vehicle.year})` : ""}`}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Type</div>
                                            <div className="text-sm text-muted-foreground capitalize">
                                                {inspection.vehicle.type || "Not specified"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Fuel Type</div>
                                            <div className="text-sm text-muted-foreground capitalize">
                                                {inspection.vehicle.fuelType || "Not specified"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Transmission</div>
                                            <div className="text-sm text-muted-foreground capitalize">
                                                {inspection.vehicle.transmission || "Not specified"}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes Section */}
                        {inspection.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{inspection.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}