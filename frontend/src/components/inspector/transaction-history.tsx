"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const transactions = [
    {
        id: "1",
        date: "2024-02-19",
        inspectionId: "INS-001",
        amount: 1500,
        platformFee: 150,
        status: "succeeded",
        customer: "John Doe",
    },
    {
        id: "2",
        date: "2024-02-18",
        inspectionId: "INS-002",
        amount: 2000,
        platformFee: 200,
        status: "pending",
        customer: "Jane Smith",
    },
    // Add more mock data as needed
]

const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500",
    succeeded: "bg-green-500/10 text-green-500",
    failed: "bg-red-500/10 text-red-500",
    refunded: "bg-blue-500/10 text-blue-500",
}

export default function TransactionHistory() {
    const [timeframe, setTimeframe] = useState("all")

    return (
        <Card>
            <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Inspection ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Net Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>{transaction.inspectionId}</TableCell>
                            <TableCell>{transaction.customer}</TableCell>
                            <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>₹{transaction.platformFee.toFixed(2)}</TableCell>
                            <TableCell>₹{(transaction.amount - transaction.platformFee).toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge className={statusColors[transaction.status as keyof typeof statusColors]}>
                                    {transaction.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

