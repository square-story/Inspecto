import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Car, CarIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Inspection, InspectionStatus } from "@/features/inspection/types";
import { formatDate } from "date-fns";
import InspectionInfo from "@/components/user/InspectionInfo";

const UpcomingInspections = ({ inspections, loading }: { inspections: Inspection[]; loading: boolean }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
            </div>
        );
    }

    if (inspections.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 p-6">
                    <p className="text-muted-foreground mb-4">No upcoming inspections found</p>
                    <Button onClick={() => navigate("/user/dashboard/inspection")}>
                        Book an Inspection
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {inspections && inspections.map((inspection) => (
                <Card key={inspection._id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                                {inspection.inspectionType.name}
                            </CardTitle>
                            <Badge variant={inspection.status === InspectionStatus.CONFIRMED ? "outline" : "secondary"}>
                                {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Ref: {inspection.bookingReference}
                        </p>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(new Date(inspection.date), 'MM/dd/yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(new Date(inspection.date), "h 'o''clock'")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{inspection.vehicle?.registrationNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span>{inspection.vehicle.make}{inspection.vehicle.vehicleModel}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <InspectionInfo inspection={inspection} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default UpcomingInspections;