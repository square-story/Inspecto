import { CalendarClock, ChevronLeft, ChevronRight, CreditCard, Info } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContentSection from "@/components/content-section"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { fetchAppointments } from "@/features/inspection/inspectionSlice"
import { fetchPayments } from "@/features/payments/paymentSlice"
import LoadingSpinner from "@/components/LoadingSpinner"

const ITEMS_PER_PAGE = 5

export default function PaymentHistory() {
    const [paymentFilter, setPaymentFilter] = useState("all")
    const [appointmentFilter, setAppointmentFilter] = useState("all")
    const [paymentPage, setPaymentPage] = useState(1)
    const [appointmentPage, setAppointmentPage] = useState(1)
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
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "failed":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    }

    return (
        <ContentSection
            title="History"
            desc="View your payment history and upcoming appointments."
            scrollAreaClassName=""
        >
            <Tabs defaultValue="payments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                    <TabsTrigger value="appointments">Upcoming Inspections</TabsTrigger>
                </TabsList>
                <TabsContent value="payments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Payment History</CardTitle>
                                    <CardDescription>View all your payment transactions</CardDescription>
                                </div>
                                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                                    <SelectTrigger className="w-[180px]">
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
                                    <div className="text-center py-4">Loading payments...</div>
                                ) : (
                                    paginatedPayments.map((payment) => (
                                        <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        Inspection Payment - {payment.inspection.bookingReference}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDateTime(payment.createdAt).date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-4">
                                                <p className="font-medium">
                                                    {payment.currency.toUpperCase()} {payment.amount}
                                                </p>
                                                <Badge variant="secondary" className={getStatusBadgeColor(payment.status)}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </Badge>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Info className="h-4 w-4" />
                                                            <span className="sr-only">More info</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Payment Details</DialogTitle>
                                                            <DialogDescription>
                                                                Additional information about this payment.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-2">
                                                            <p><strong>Reference:</strong> {payment.inspection.bookingReference}</p>
                                                            <p><strong>Amount:</strong> {payment.currency.toUpperCase()} {payment.amount}</p>
                                                            <p><strong>Status:</strong> {payment.status}</p>
                                                            <p><strong>Date:</strong> {formatDateTime(payment.createdAt).date}</p>
                                                            <p><strong>Time:</strong> {formatDateTime(payment.createdAt).time}</p>
                                                            <p><strong>Payment ID:</strong> {payment.stripePaymentIntentId}</p>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPaymentPage((page) => Math.max(1, page - 1))}
                                disabled={paymentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {paymentPage} of {Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setPaymentPage((page) => Math.min(Math.ceil(filteredPayments.length / ITEMS_PER_PAGE), page + 1))
                                }
                                disabled={paymentPage === Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="appointments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Upcoming Inspections</CardTitle>
                                    <CardDescription>Your scheduled vehicle inspections</CardDescription>
                                </div>
                                <Select value={appointmentFilter} onValueChange={setAppointmentFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Inspections</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {inspectionsLoading ? (

                                    <div className="text-center py-4"><LoadingSpinner />Loading inspections...</div>
                                ) : (
                                    paginatedInspections.map((inspection) => (
                                        <div key={inspection._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <CalendarClock className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {inspection.inspectionType.charAt(0).toUpperCase() +
                                                            inspection.inspectionType.slice(1)} Inspection
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {inspection.bookingReference} • {formatDateTime(inspection.date as unknown as string).date} at{" "} {inspection.slotNumber <= 2 ? "Morning" : inspection.slotNumber <= 4 ? "Afternoon" : "Evening"}

                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-4">
                                                <Badge variant="secondary" className={getStatusBadgeColor(inspection.status)}>
                                                    {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                                                </Badge>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Info className="h-4 w-4" />
                                                            <span className="sr-only">More info</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Inspection Details</DialogTitle>
                                                            <DialogDescription>
                                                                Additional information about this inspection.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-2">
                                                            <p><strong>Reference:</strong> {inspection.bookingReference}</p>
                                                            <p><strong>Type:</strong> {inspection.inspectionType}</p>
                                                            <p><strong>Date:</strong> {formatDateTime(inspection.date as unknown as string).date}</p>
                                                            <p><strong>Status:</strong> {inspection.status}</p>
                                                            <p><strong>Location:</strong> {inspection.location}</p>
                                                            <p><strong>Slot Number:</strong> {inspection.slotNumber}</p>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAppointmentPage((page) => Math.max(1, page - 1))}
                                disabled={appointmentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {appointmentPage} of {Math.ceil(filteredInspections.length / ITEMS_PER_PAGE)}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setAppointmentPage((page) =>
                                        Math.min(Math.ceil(filteredInspections.length / ITEMS_PER_PAGE), page + 1)
                                    )
                                }
                                disabled={appointmentPage === Math.ceil(filteredInspections.length / ITEMS_PER_PAGE)}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </ContentSection>
    )
}
