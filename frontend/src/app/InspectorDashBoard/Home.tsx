"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, ArrowRight, Calendar, DollarSign, FileCheck, User, Users } from "lucide-react"

export default function Dashboard() {
    // Mock data - replace with real data from your API
    const stats = {
        totalInspections: 145,
        pendingInspections: 12,
        totalEarnings: 28500,
        thisMonthEarnings: 4500,
        completionRate: 92,
    }

    const recentInspections = [
        {
            id: "INS-001",
            customerName: "John Doe",
            date: "2024-02-19",
            status: "completed",
            amount: 350,
            type: "Vehicle Inspection",
        },
        {
            id: "INS-001",
            customerName: "John Doe",
            date: "2024-02-19",
            status: "completed",
            amount: 350,
            type: "Vehicle Inspection",
        },
        {
            id: "INS-001",
            customerName: "John Doe",
            date: "2024-02-19",
            status: "completed",
            amount: 250,
            type: "Vehicle Inspection",
        },
        // Add more mock data as needed
    ]

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalInspections}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Inspections</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingInspections}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completionRate}%</div>
                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <Button>
                    Schedule New Inspection
                </Button>
                <Button variant="outline">
                    View All Inspections
                </Button>
                <Button variant="outline">
                    View Earnings Report
                </Button>
            </div>

            {/* Recent Inspections */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Inspections</CardTitle>
                    <CardDescription>Overview of your latest inspection activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentInspections.map((inspection) => (
                                <TableRow key={inspection.id}>
                                    <TableCell className="font-medium">{inspection.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            {inspection.customerName}
                                        </div>
                                    </TableCell>
                                    <TableCell>{inspection.date}</TableCell>
                                    <TableCell>{inspection.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={inspection.status === "completed" ? "default" : "destructive"}>
                                            {inspection.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${inspection.amount}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Monthly Overview */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Performance</CardTitle>
                        <CardDescription>Your inspection metrics for this month</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Completed Inspections</span>
                            </div>
                            <span className="font-bold">24</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>New Customers</span>
                            </div>
                            <span className="font-bold">18</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>Month's Earnings</span>
                            </div>
                            <span className="font-bold">${stats.thisMonthEarnings}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Schedule</CardTitle>
                        <CardDescription>Your next 3 inspections</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">Vehicle Inspection #{i + 1}</p>
                                        <p className="text-sm text-muted-foreground">Tomorrow at {9 + i}:00 AM</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

