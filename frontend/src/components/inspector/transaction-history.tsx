"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionStats } from "@/types/inspector.wallet.stats"



const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500",
    succeeded: "bg-green-500/10 text-green-500",
    failed: "bg-red-500/10 text-red-500",
    refunded: "bg-blue-500/10 text-blue-500",
}

export interface TransactionHistoryProps {
    recentTransactions: TransactionStats[]
}

export default function TransactionHistory({ recentTransactions }: TransactionHistoryProps) {
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
                        <TableHead>Amount</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Net Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentTransactions.map((recentTransactions) => (
                        <TableRow key={recentTransactions._id}>
                            <TableCell>{new Date(recentTransactions.date).toLocaleDateString()}</TableCell>
                            <TableCell>₹{(recentTransactions.amount + 50).toFixed(2)}</TableCell>
                            <TableCell>₹{50}</TableCell>
                            <TableCell>₹{(recentTransactions.amount).toFixed(2)}</TableCell>
                            <TableCell>
                                <Badge className={statusColors[recentTransactions.status as keyof typeof statusColors]}>
                                    {recentTransactions.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

