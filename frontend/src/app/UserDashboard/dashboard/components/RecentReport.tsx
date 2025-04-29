import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Download, Eye } from "lucide-react";

interface Report {
    _id: string;
    inspectionId: string;
    reportNumber: string;
    createdAt: string;
    vehicleDetails: {
        make: string;
        model: string;
        registrationNumber: string;
    };
    inspectionType: string;
    status: "completed" | "pending" | "failed";
    downloadUrl?: string;
}

const RecentReports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // In a real implementation, fetch data from API
        // For now, using mock data
        setTimeout(() => {
            setReports([
                {
                    _id: "rep1",
                    inspectionId: "insp1",
                    reportNumber: "RPT-2023-001",
                    createdAt: "2023-05-15T10:00:00",
                    vehicleDetails: {
                        make: "Toyota",
                        model: "Camry",
                        registrationNumber: "KA-01-AB-1234"
                    },
                    inspectionType: "comprehensive",
                    status: "completed",
                    downloadUrl: "/reports/RPT-2023-001.pdf"
                },
                {
                    _id: "rep2",
                    inspectionId: "insp2",
                    reportNumber: "RPT-2023-002",
                    createdAt: "2023-04-20T14:30:00",
                    vehicleDetails: {
                        make: "Honda",
                        model: "City",
                        registrationNumber: "KA-02-CD-5678"
                    },
                    inspectionType: "basic",
                    status: "completed",
                    downloadUrl: "/reports/RPT-2023-002.pdf"
                },
                {
                    _id: "rep3",
                    inspectionId: "insp3",
                    reportNumber: "RPT-2023-003",
                    createdAt: "2023-03-10T09:15:00",
                    vehicleDetails: {
                        make: "Maruti Suzuki",
                        model: "Swift",
                        registrationNumber: "KA-03-EF-9012"
                    },
                    inspectionType: "pre-purchase",
                    status: "completed",
                    downloadUrl: "/reports/RPT-2023-003.pdf"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleViewReport = (id: string) => {
        navigate(`/user/dashboard/reports/${id}`);
    };

    const handleDownloadReport = (url: string) => {
        // In a real implementation, this would trigger a download
        console.log("Downloading report:", url);
        // window.open(url, '_blank');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "completed":
                return "success";
            case "pending":
                return "outline";
            case "failed":
                return "destructive";
            default:
                return "secondary";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 p-6">
                    <p className="text-muted-foreground">No inspection reports found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <Card key={report._id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                                Report #{report.reportNumber}
                            </CardTitle>
                            <Badge variant={getStatusBadgeVariant(report.status) as any}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(report.createdAt)}
                        </p>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Vehicle:</span> {report.vehicleDetails.make} {report.vehicleDetails.model}
                            </p>
                            <p>
                                <span className="font-medium">Registration:</span> {report.vehicleDetails.registrationNumber}
                            </p>
                            <p>
                                <span className="font-medium">Inspection Type:</span> {report.inspectionType.charAt(0).toUpperCase() + report.inspectionType.slice(1)}
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewReport(report._id)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Button>
                            {report.downloadUrl && (
                                <Button 
                                    size="sm"
                                    onClick={() => handleDownloadReport(report.downloadUrl!)}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default RecentReports;