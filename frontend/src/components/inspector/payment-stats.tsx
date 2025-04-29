"use client"

import { Card } from "@/components/ui/card"
import { MonthlyStats } from "@/types/wallet.stats";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"


export interface PaymentStatsProps {
    monthlyData: MonthlyStats[];
}

export default function PaymentStats({ monthlyData }: PaymentStatsProps) {
    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-6">Monthly Earnings Overview</h3>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="earnings" name="Total Earnings" fill="#2563eb" />
                        <Bar dataKey="platformFee" name="Platform Fees" fill="#64748b" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

