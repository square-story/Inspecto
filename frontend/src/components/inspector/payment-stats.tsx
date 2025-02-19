"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const monthlyData = [
    { month: "Jan", earnings: 45000, platformFees: 4500 },
    { month: "Feb", earnings: 52000, platformFees: 5200 },
    { month: "Mar", earnings: 48000, platformFees: 4800 },
    { month: "Apr", earnings: 61000, platformFees: 6100 },
    { month: "May", earnings: 55000, platformFees: 5500 },
    { month: "Jun", earnings: 67000, platformFees: 6700 },
]

export default function PaymentStats() {
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
                        <Bar dataKey="platformFees" name="Platform Fees" fill="#64748b" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

