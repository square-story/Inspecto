import { Download, Info, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { ReviewDialog } from '../ReviewComponent';
import { Inspection, InspectionStatus } from '@/features/inspection/types';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { IReview } from '@/types/review';
import { ReviewService } from '@/services/review.service';
import { toast } from 'sonner';
import { getSignedPdfUrl } from '@/utils/cloudinary';
import { saveAs } from "file-saver"
import { Badge } from '../ui/badge';

const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "succeeded":
        case "confirmed":
        case "completed":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        case "failed":
        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
}

const InspectionInfo = ({ inspection }: { inspection: Inspection }) => {
    const [existingReview, setExistingReview] = useState<IReview | null>(null);
    const [hasExistingReview, setHasExistingReview] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const checkExistingReview = async (inspectionId: string) => {
        try {
            // Call your review service to check for existing reviews
            const review = await ReviewService.getInspectionReview(inspectionId);

            if (review) {
                setExistingReview(review);
                setHasExistingReview(true);
            } else {
                setExistingReview(null);
                setHasExistingReview(false);
            }
        } catch (error) {
            console.error("Error checking for existing review:", error);
            toast.error("Failed to check for existing review");
            setExistingReview(null);
            setHasExistingReview(false);
            setReviewDialogOpen(true);
        }
    };

    const handleDownloadReport = async () => {
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

    return (
        <Dialog>
            <DialogTrigger asChild onClick={() => {
                checkExistingReview(inspection._id);
            }}>
                <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">More info</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Inspection Details</DialogTitle>
                    <DialogDescription>
                        Information about your vehicle inspection appointment
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <p className="text-muted-foreground">Reference:</p>
                        <p className="font-medium">{inspection.bookingReference}</p>

                        <p className="text-muted-foreground">Inspector Name</p>
                        <p className="capitalize">{inspection.inspector.firstName}</p>

                        <p className="text-muted-foreground">Type:</p>
                        <p className="capitalize">{inspection.inspectionType.name}</p>

                        <p className="text-muted-foreground">Date:</p>
                        <p>{formatDate(inspection.date, 'MM/dd/yyyy')}</p>

                        <p className="text-muted-foreground">Time Slot:</p>
                    <p>{inspection.timeSlot.startTime + '-' + inspection.timeSlot.endTime}</p>

                        <p className="text-muted-foreground">Status:</p>
                        <p>
                            <Badge className={getStatusBadgeColor(inspection.status)}>
                                {inspection.status}
                            </Badge>
                        </p>

                        <p className="text-muted-foreground">Location:</p>
                        <p>{inspection.location}</p>
                    </div>
                </div>
                <DialogFooter className="flex justify-between items-center mt-4">
                    {inspection.status === InspectionStatus.COMPLETED && (
                        <>
                            <Button
                                onClick={() => handleDownloadReport()}
                                className="w-full sm:w-auto"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Inspection Report
                            </Button>
                            <Button
                                onClick={() => {
                                    setReviewDialogOpen(true);
                                }}
                                className="w-full"
                            >
                                {hasExistingReview || existingReview ? (
                                    <>
                                        View Review
                                        <Star className="fill-yellow-400 h-4 w-4 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Give Review
                                        <Star className="fill-white h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
                <ReviewDialog
                    open={reviewDialogOpen}
                    onOpenChange={setReviewDialogOpen}
                    inspectionId={inspection._id}
                    inspectorId={inspection.inspector._id}
                    existingReview={existingReview || undefined}
                />
            </DialogContent>
        </Dialog>
    )
}

export default InspectionInfo