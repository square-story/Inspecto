/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Download,
    FileText,
    Info,
    RefreshCcw,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ContentSection from "@/components/content-section"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchAppointments } from "@/features/inspection/inspectionSlice"
import { fetchPayments } from "@/features/payments/paymentSlice"
import LoadingSpinner from "@/components/LoadingSpinner"
import InvoiceGenerator from "./components/invoice-generator"
import { IPayments } from "@/features/payments/types"
import StripePaymentWrapper from "@/components/StripePaymentWrapper"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSignedPdfUrl } from "@/utils/cloudinary";
import { saveAs } from 'file-saver';
import { ReviewDialog } from "@/components/ReviewComponent"

const ITEMS_PER_PAGE = 5

// Payment status enum to match the schema
enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
}

// Inspection status enum
enum InspectionStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

// Function to format currency in Indian Rupees
const formatIndianRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount)
}

// Timer component for pending payments
const PaymentTimer = ({ createdAt, onExpired }: { createdAt: string; onExpired: () => void }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const [progress, setProgress] = useState<number>(100)

    useEffect(() => {
        const paymentTime = new Date(createdAt).getTime()
        const expiryTime = paymentTime + 10 * 60 * 1000 // 10 minutes in milliseconds

        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const difference = expiryTime - now

            if (difference <= 0) {
                setTimeLeft(0)
                setProgress(0)
                onExpired()
                clearInterval(timer)
                return
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60)
            const seconds = Math.floor((difference / 1000) % 60)
            setTimeLeft(minutes * 60 + seconds)

            // Calculate progress percentage
            const totalTime = 10 * 60 // 10 minutes in seconds
            const elapsedTime = totalTime - (minutes * 60 + seconds)
            const progressPercentage = 100 - (elapsedTime / totalTime) * 100
            setProgress(progressPercentage)
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [createdAt, onExpired])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payment window closing in:</span>
                <span className="text-sm font-bold">{`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    )
}

export default function PaymentHistory() {
    const [paymentFilter, setPaymentFilter] = useState("all")
    const [appointmentFilter, setAppointmentFilter] = useState("all")
    const [paymentPage, setPaymentPage] = useState(1)
    const [appointmentPage, setAppointmentPage] = useState(1)
    const [activePaymentId, setActivePaymentId] = useState<string | null>(null)
    const [invoicePayment, setInvoicePayment] = useState<any>(null)
    const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false)
    const [retryPayment, setRetryPayment] = useState<any>(null)
    const dispatch = useDispatch<AppDispatch>()
    const { data: payments, loading: paymentsLoading } = useSelector((state: RootState) => state.payments)
    const { data: inspections, loading: inspectionsLoading } = useSelector((state: RootState) => state.inspections)



    useEffect(() => {
        dispatch(fetchAppointments())
        dispatch(fetchPayments())
    }, [dispatch])

    const filteredPayments = useMemo(() => {
        if (!payments) return []
        if (paymentFilter === "all") return payments
        return payments.filter((payment) => payment.status === paymentFilter)
    }, [payments, paymentFilter])

    const filteredInspections = useMemo(() => {
        if (!inspections) return []
        if (appointmentFilter === "all") return inspections
        return inspections.filter((inspection) => inspection.status === appointmentFilter)
    }, [inspections, appointmentFilter])

    const paginatedPayments = useMemo(() => {
        const startIndex = (paymentPage - 1) * ITEMS_PER_PAGE
        return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredPayments, paymentPage])

    const paginatedInspections = useMemo(() => {
        const startIndex = (appointmentPage - 1) * ITEMS_PER_PAGE
        return filteredInspections.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredInspections, appointmentPage])

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

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            fullDateTime: date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        }
    }

    const handleDownloadInvoice = (payment: IPayments) => {
        console.log(`Opening invoice for payment: ${payment._id}`)
        setInvoicePayment(payment)
    }

    const handleDownloadReport = async (inspectionId: string) => {
        try {
            const inspection = inspections?.find(i => i._id === inspectionId);
            if (!inspection?.report?.reportPdfUrl) {
                toast.error('Report PDF not available');
                return;
            }

            // Get signed URL from backend
            const signedUrl = await getSignedPdfUrl(inspection.report.reportPdfUrl);

            // Fetch the PDF blob
            const response = await fetch(signedUrl);
            const pdfBlob = await response.blob();

            // Download with proper filename
            const filename = `Inspection-Report-${inspection.bookingReference}.pdf`;
            saveAs(pdfBlob, filename);

            toast.success('Report download started');
        } catch (error) {
            console.error('Error downloading report:', error);
            toast.error('Failed to download report. Please try again.');
        }
    }

    const handlePaymentExpired = (paymentId: string) => {
        console.log(`Payment window expired for: ${paymentId}`)
        // You might want to update the payment status or show a notification
    }

    const handleRetryPayment = (payment: any) => {
        setRetryPayment(payment)
    }


    const handleRetrySuccess = async () => {
        toast.success(`Payment retry successful`);
        setRetryPayment(null);
        await dispatch(fetchPayments());
    }

    const handleRetryError = async (message: string) => {
        toast.error(`Payment retry failed: ${message}`);
        setRetryPayment(null);
        await dispatch(fetchPayments());
    }

    const getTimeSlotLabel = (slotNumber: number) => {
        if (slotNumber <= 2) return "Morning (9 AM - 12 PM)"
        if (slotNumber <= 4) return "Afternoon (1 PM - 4 PM)"
        return "Evening (5 PM - 8 PM)"
    }

    return (
        <ContentSection
            title="Transaction History"
            desc="View your payment history and inspection appointments."
            scrollAreaClassName=""
        >
            <Tabs defaultValue="payments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                    <TabsTrigger value="appointments">Inspection Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Payment Transactions</CardTitle>
                                    <CardDescription>View and manage all your payment transactions</CardDescription>
                                </div>
                                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Payments</SelectItem>
                                        <SelectItem value="succeeded">Succeeded</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {paymentsLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <LoadingSpinner />
                                        <span className="ml-2">Loading payment history...</span>
                                    </div>
                                ) : paginatedPayments.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No payment records found</p>
                                        <p className="text-sm">Try changing your filter or check back later</p>
                                    </div>
                                ) : (
                                    paginatedPayments.map((payment) => (
                                        <div
                                            key={payment._id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Inspection Payment - {payment.inspection.bookingReference}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDateTime(payment.createdAt).fullDateTime}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-11 sm:ml-0">
                                                <p className="font-medium">{formatIndianRupees(payment.amount)}</p>
                                                <Badge variant="secondary" className={getStatusBadgeColor(payment.status)}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </Badge>

                                                {payment.status === PaymentStatus.PENDING && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="outline" size="sm" onClick={() => handleRetryPayment(payment)}>
                                                                    <RefreshCcw className="h-4 w-4 mr-1" />
                                                                    Pay Now
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Complete your pending payment</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                {payment.status === PaymentStatus.SUCCEEDED && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(payment)}>
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Invoice
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View and download invoice</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Info className="h-4 w-4" />
                                                            <span className="sr-only">More info</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Payment Details</DialogTitle>
                                                            <DialogDescription>Transaction information and payment details</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                                <p className="text-muted-foreground">Reference:</p>
                                                                <p className="font-medium">{payment.inspection.bookingReference}</p>

                                                                <p className="text-muted-foreground">Amount:</p>
                                                                <p className="font-medium">{formatIndianRupees(payment.amount)}</p>

                                                                <p className="text-muted-foreground">Status:</p>
                                                                <p>
                                                                    <Badge className={getStatusBadgeColor(payment.status)}>
                                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                                    </Badge>
                                                                </p>

                                                                <p className="text-muted-foreground">Date & Time:</p>
                                                                <p>{formatDateTime(payment.createdAt).fullDateTime}</p>

                                                                <p className="text-muted-foreground">Payment ID:</p>
                                                                <p className="font-mono text-xs break-all">{payment.stripePaymentIntentId}</p>

                                                                {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                                                                    <>
                                                                        <p className="text-muted-foreground">Additional Info:</p>
                                                                        <div>
                                                                            {Object.entries(payment.metadata).map(([key, value]) => (
                                                                                <p key={key} className="text-xs">
                                                                                    <span className="font-medium">{key}:</span> {value as string}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {payment.status === PaymentStatus.PENDING && (
                                                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-md">
                                                                    <PaymentTimer
                                                                        createdAt={payment.createdAt}
                                                                        onExpired={() => handlePaymentExpired(payment._id)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center mt-4">
                                                            {payment.status === PaymentStatus.SUCCEEDED && (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => handleDownloadInvoice(payment)}
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Download Invoice
                                                                </Button>
                                                            )}

                                                            {payment.status === PaymentStatus.PENDING && (
                                                                <Button onClick={() => handleRetryPayment(payment)} className="w-full sm:w-auto">
                                                                    Complete Payment
                                                                </Button>
                                                            )}
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPaymentPage((page) => Math.max(1, page - 1))}
                                    disabled={paymentPage === 1 || paginatedPayments.length === 0}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setPaymentPage((page) => Math.min(Math.ceil(filteredPayments.length / ITEMS_PER_PAGE), page + 1))
                                    }
                                    disabled={
                                        paymentPage === Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) ||
                                        paginatedPayments.length === 0
                                    }
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {filteredPayments.length > 0 ? (
                                    <>
                                        Page {paymentPage} of {Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)}
                                    </>
                                ) : (
                                    <>No results</>
                                )}
                            </span>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="appointments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Inspection Appointments</CardTitle>
                                    <CardDescription>Your scheduled vehicle inspections</CardDescription>
                                </div>
                                <Select value={appointmentFilter} onValueChange={setAppointmentFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Inspections</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {inspectionsLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <LoadingSpinner />
                                        <span className="ml-2">Loading inspection appointments...</span>
                                    </div>
                                ) : paginatedInspections.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CalendarClock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No inspection appointments found</p>
                                        <p className="text-sm">Try changing your filter or schedule a new inspection</p>
                                    </div>
                                ) : (
                                    paginatedInspections.map((inspection) => (
                                        <div
                                            key={inspection._id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <CalendarClock className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {inspection.inspectionType.charAt(0).toUpperCase() + inspection.inspectionType.slice(1)}{" "}
                                                        Inspection
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {inspection.bookingReference} • {formatDateTime(inspection.date as unknown as string).date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-11 sm:ml-0">
                                                <Badge variant="secondary" className={getStatusBadgeColor(inspection.status)}>
                                                    {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                                                </Badge>

                                                {inspection.status === InspectionStatus.COMPLETED && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDownloadReport(inspection._id)}
                                                                >
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Report
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Download inspection report</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}

                                                <Dialog>
                                                    <DialogTrigger asChild>
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
                                                                <p className="capitalize">{inspection.inspectionType}</p>

                                                                <p className="text-muted-foreground">Date:</p>
                                                                <p>{formatDateTime(inspection.date as unknown as string).date}</p>

                                                                <p className="text-muted-foreground">Time Slot:</p>
                                                                <p>{getTimeSlotLabel(inspection.slotNumber)}</p>


                                                                <p className="text-muted-foreground">Status:</p>
                                                                <p>
                                                                    <Badge className={getStatusBadgeColor(inspection.status)}>
                                                                        {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
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
                                                                        onClick={() => handleDownloadReport(inspection._id)}
                                                                        className="w-full sm:w-auto"
                                                                    >
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                        Download Inspection Report
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => setReviewDialogOpen(true)}
                                                                        className="w-full"
                                                                    >
                                                                        Leave a Review
                                                                    </Button>
                                                                </>

                                                            )}
                                                        </DialogFooter>
                                                        <ReviewDialog
                                                            open={reviewDialogOpen}
                                                            onOpenChange={setReviewDialogOpen}
                                                            inspectionId={inspection._id}
                                                            inspectorId={inspection.inspector._id}
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAppointmentPage((page) => Math.max(1, page - 1))}
                                    disabled={appointmentPage === 1 || paginatedInspections.length === 0}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setAppointmentPage((page) =>
                                            Math.min(Math.ceil(filteredInspections.length / ITEMS_PER_PAGE), page + 1),
                                        )
                                    }
                                    disabled={
                                        appointmentPage === Math.ceil(filteredInspections.length / ITEMS_PER_PAGE) ||
                                        paginatedInspections.length === 0
                                    }
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {filteredInspections.length > 0 ? (
                                    <>
                                        Page {appointmentPage} of {Math.ceil(filteredInspections.length / ITEMS_PER_PAGE)}
                                    </>
                                ) : (
                                    <>No results</>
                                )}
                            </span>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Payment Completion Dialog */}
            {activePaymentId && (
                <Dialog open={!!activePaymentId} onOpenChange={(open) => !open && setActivePaymentId(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Complete Your Payment</DialogTitle>
                            <DialogDescription>
                                Please complete your payment within the time limit to confirm your inspection appointment.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-md">
                                <PaymentTimer
                                    createdAt={payments?.find((p) => p._id === activePaymentId)?.createdAt || new Date().toISOString()}
                                    onExpired={() => handlePaymentExpired(activePaymentId)}
                                />
                            </div>

                            <div className="border rounded-lg p-4">
                                <p className="font-medium mb-2">Payment Summary</p>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-muted-foreground">Inspection Fee</span>
                                    <span>{formatIndianRupees(payments?.find((p) => p._id === activePaymentId)?.amount || 0)}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-muted-foreground">Taxes</span>
                                    <span>Included</span>
                                </div>
                                <div className="border-t my-2"></div>
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>{formatIndianRupees(payments?.find((p) => p._id === activePaymentId)?.amount || 0)}</span>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={() => setActivePaymentId(null)} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                            <Button className="w-full sm:w-auto">
                                Proceed to Payment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Invoice Generator Dialog */}
            {invoicePayment && (
                <InvoiceGenerator payment={invoicePayment} open={!!invoicePayment} onClose={() => setInvoicePayment(null)} />
            )}
            {retryPayment && (
                <Dialog open={!!retryPayment} onOpenChange={(open) => !open && setRetryPayment(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Retry Payment</DialogTitle>
                            <DialogDescription>
                                Please complete your payment to confirm your inspection appointment.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-5 scroll-smooth">
                            <StripePaymentWrapper
                                amount={retryPayment.amount}
                                inspectionId={retryPayment.inspection._id}
                                onPaymentSuccess={handleRetrySuccess}
                                onPaymentError={handleRetryError}
                                isRetry={true}
                                paymentIntentId={retryPayment.stripePaymentIntentId}
                            />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
        </ContentSection>
    )
}

