import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CarIcon, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Inspection {
    _id: string;
    bookingReference: string;
    inspectionType: string;
    scheduledDate: string;
    status: string;
    vehicleDetails: {
        make: string;
        model: string;
        year: string;
        registrationNumber: string;
    };
    location: string;
}

const UpcomingInspections = () => {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // In a real implementation, fetch data from API
        // For now, using mock data
        setTimeout(() => {
            setInspections([
                {
                    _id: "insp1",
                    bookingReference: "INS-2023-001",
                    inspectionType: "comprehensive",
                    scheduledDate: "2023-06-15T10:00:00",
                    status: "scheduled",
                    vehicleDetails: {
                        make: "Toyota",
                        model: "Camry",
                        year: "2019",
                        registrationNumber: "KA-01-AB-1234"
                    },
                    location: "Bangalore Service Center"
                },
                {
                    _id: "insp2",
                    bookingReference: "INS-2023-002",
                    inspectionType: "basic",
                    scheduledDate: "2023-06-20T14:30:00",
                    status: "scheduled",
                    vehicleDetails: {
                        make: "Honda",
                        model: "City",
                        year: "2020",
                        registrationNumber: "KA-02-CD-5678"
                    },
                    location: "Mumbai Service Center"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleViewDetails = (id: string) => {
        navigate(`/user/dashboard/inspection/${id}`);
    };

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
            {inspections.map((inspection) => (
                <Card key={inspection._id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                                {inspection.vehicleDetails.make} {inspection.vehicleDetails.model}
                            </CardTitle>
                            <Badge variant={inspection.status === "scheduled" ? "outline" : "secondary"}>
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
                                <span>{formatDate(inspection.scheduledDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{formatTime(inspection.scheduledDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{inspection.vehicleDetails.registrationNumber}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button 
                                variant="outline" 
                                onClick={() => handleViewDetails(inspection._id)}
                            >
                                View Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default UpcomingInspections;