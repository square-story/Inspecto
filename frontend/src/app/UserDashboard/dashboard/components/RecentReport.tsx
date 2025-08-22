import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Download, Eye } from "lucide-react";
import { Inspection } from "@/features/inspection/types";
import { formatDate } from "date-fns";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { getSignedPdfUrl } from "@/utils/cloudinary";


const RecentReports = ({ reports, loading }: { reports: Inspection[], loading: boolean }) => {
    const navigate = useNavigate();


    const handleViewReport = (report: Inspection) => {
        navigate(`/user/dashboard/report/${report._id}`);
    };

    const handleDownloadReport = async (inspection: Inspection) => {
        try {
            if (!inspection?.report?.reportPdfUrl) {
                toast.error("Report PDF not available")
                return
            }

            // Get signed URL from backend
            const signedUrl = await getSignedPdfUrl(inspection.report.reportPdfUrl)

            // Fetch the PDF blob
            const response = await fetch(signedUrl)
            const pdfBlob = await response.blob()

            // Download with proper filename
            const filename = `Inspection-Report-${inspection.bookingReference}.pdf`
            saveAs(pdfBlob, filename)

            toast.success("Report download started")
        } catch (error) {
            console.error("Error downloading report:", error)
            toast.error("Failed to download report. Please try again.")
        }
    }

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
                                Report #{report.bookingReference}
                            </CardTitle>
                            <Badge>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(report.date, 'MM/dd/yyyy')}
                        </p>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Vehicle:</span> {report.vehicle?.make} {report.vehicle?.vehicleModel}
                            </p>
                            <p>
                                <span className="font-medium">Registration:</span> {report.vehicle?.registrationNumber}
                            </p>
                            <p>
                                <span className="font-medium">Inspection Type:</span> {report.inspectionType.name.charAt(0).toUpperCase() + report.inspectionType.name.slice(1)}
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewReport(report)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Button>
                            {report.report?.reportPdfUrl && (
                                <Button
                                    size="sm"
                                    onClick={() => handleDownloadReport(report)}
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