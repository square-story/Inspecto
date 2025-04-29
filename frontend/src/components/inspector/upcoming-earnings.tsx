"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { WithdrawalService } from "@/services/withdrawal.service"
import { WithdrawalStats } from "@/types/wallet.stats"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function WithdrawalStates() {
    const [withdrawals, setWithdrawals] = useState<WithdrawalStats[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const data = await WithdrawalService.getInspctorWithdrawalHistory()
                setWithdrawals(data)
            } catch (error) {
                console.error("Failed to fetch withdrawal data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchWithdrawals()
    }, [])

    const totalWithdrawn = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0)

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                    <h3 className="font-medium text-sm text-muted-foreground">Total Withdrawn</h3>
                    <p className="text-2xl font-bold">
                        {loading ? <LoadingSpinner /> : `₹${totalWithdrawn.toFixed(2)}`}
                    </p>
                </Card>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>Method</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    <LoadingSpinner />
                                </TableCell>
                            </TableRow>
                        ) : withdrawals.length > 0 ? (
                            withdrawals.map((withdrawal) => (
                                <TableRow key={withdrawal.id}>
                                    <TableCell>{withdrawal.id}</TableCell>
                                    <TableCell>₹{withdrawal.amount.toFixed(2)}</TableCell>
                                    <TableCell>{withdrawal.status}</TableCell>
                                    <TableCell>
                                        {new Date(withdrawal.requestDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{withdrawal.method}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No withdrawal data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}