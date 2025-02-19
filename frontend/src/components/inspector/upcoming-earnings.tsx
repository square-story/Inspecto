"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const upcomingPayments = [
    {
        id: "1",
        dueDate: "2024-03-01",
        inspectionId: "INS-003",
        amount: 3000,
        platformFee: 300,
        customer: "Alice Johnson",
    },
    {
        id: "2",
        dueDate: "2024-03-05",
        inspectionId: "INS-004",
        amount: 2500,
        platformFee: 250,
        customer: "Bob Wilson",
    },
]

export default function UpcomingEarnings() {
    const totalUpcoming = upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const totalPlatformFees = upcomingPayments.reduce((sum, payment) => sum + payment.platformFee, 0)

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Total Upcoming Earnings</h3>
                    <p className="text-2xl font-bold">₹{totalUpcoming.toFixed(2)}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Estimated Platform Fees</h3>
                    <p className="text-2xl font-bold">₹{totalPlatformFees.toFixed(2)}</p>
                </Card>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Inspection ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Platform Fee</TableHead>
                            <TableHead>Net Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {upcomingPayments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{payment.inspectionId}</TableCell>
                                <TableCell>{payment.customer}</TableCell>
                                <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                                <TableCell>₹{payment.platformFee.toFixed(2)}</TableCell>
                                <TableCell>₹{(payment.amount - payment.platformFee).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

