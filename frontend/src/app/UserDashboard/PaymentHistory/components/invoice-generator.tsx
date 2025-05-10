"use client"

import { useRef } from "react"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IPayments } from "@/features/payments/types"

interface InvoiceGeneratorProps {
    payment: IPayments
    open: boolean
    onClose: () => void
}

export default function InvoiceGenerator({ payment, open, onClose }: InvoiceGeneratorProps) {
    const invoiceRef = useRef<HTMLDivElement>(null)

    const formatIndianRupees = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }


    const handlePrint = () => {
        window.print()
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center">
                        <span>Invoice #{payment.stripePaymentIntentId.slice(-8).toUpperCase()}</span>

                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-5 scroll-smooth">
                    <div ref={invoiceRef} className="print:p-10">
                        <Card className="w-full mx-auto print:shadow-none border-0 print:border-0">
                            <CardHeader className="border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Invoice</CardTitle>
                                        <p className="text-sm text-muted-foreground">#{payment.stripePaymentIntentId.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl">Inspecto</p>
                                        <p className="text-sm text-muted-foreground">Vehicle Inspection Services</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 py-6">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-medium text-sm">Bill To:</h3>
                                        <p>{payment.user.firstName}</p>
                                        <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-medium text-sm">Invoice Details:</h3>
                                        <p>Date: {formatDate(payment.createdAt)}</p>
                                        <p>Invoice #: INV-{payment.stripePaymentIntentId.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="border rounded-md">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-3">Description</th>
                                                <th className="text-right p-3">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-3">
                                                    <p>
                                                        {payment.inspection.inspectionType.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Booking Reference: {payment.inspection.bookingReference}
                                                    </p>
                                                </td>
                                                <td className="text-right p-3">{formatIndianRupees(payment.amount - 50)}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3">Platform Fee</td>
                                                <td className="text-right p-3">{formatIndianRupees(50)}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t font-medium">
                                                <td className="p-3">Total</td>
                                                <td className="text-right p-3">{formatIndianRupees(payment.amount)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium">Payment Information</h3>
                                    <p className="text-sm">Payment ID: {payment.stripePaymentIntentId}</p>
                                    <p className="text-sm">Payment Method: Credit Card</p>
                                    <p className="text-sm">Payment Status: Paid</p>
                                </div>

                                <div className="border-t pt-4 text-sm text-muted-foreground">
                                    <p>Thank you for your business. For any queries, please contact support@inspecto.com</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t print:hidden">
                                <Button variant="outline" onClick={handlePrint}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                </Button>
                                {/* <Button onClick={handleDownload} disabled={generating}>
                                    {generating ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Generating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download PDF
                                        </span>
                                    )}
                                </Button> */}
                            </CardFooter>
                        </Card>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

