"use client"

import { CalendarClock, CreditCard } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContentSection from "@/components/content-section"

const payments = [
    {
        id: 1,
        date: "Feb 15, 2024",
        amount: "$150.00",
        description: "Vehicle Inspection - Toyota Camry",
        status: "completed",
    },
    {
        id: 2,
        date: "Jan 30, 2024",
        amount: "$85.00",
        description: "Oil Change Service",
        status: "completed",
    },
    {
        id: 3,
        date: "Feb 20, 2024",
        amount: "$220.00",
        description: "Brake Inspection and Service",
        status: "pending",
    },
    {
        id: 4,
        date: "Feb 18, 2024",
        amount: "$175.00",
        description: "Tire Rotation Service",
        status: "failed",
    },
]

const appointments = [
    {
        id: 1,
        date: "2024-02-17",
        time: "10:00 AM",
        service: "Annual Vehicle Inspection",
        vehicle: "Toyota Camry",
        price: "$150.00",
        status: "scheduled",
    },
    {
        id: 2,
        date: "2024-02-18",
        time: "2:30 PM",
        service: "Oil Change Service",
        vehicle: "Toyota Camry",
        price: "$85.00",
        status: "scheduled",
    },
    {
        id: 3,
        date: "2024-02-22",
        time: "11:00 AM",
        service: "Brake Service",
        vehicle: "Toyota Camry",
        price: "$220.00",
        status: "confirmed",
    },
    {
        id: 4,
        date: "2024-02-17",
        time: "4:00 PM",
        service: "Tire Rotation",
        vehicle: "Toyota Camry",
        price: "$175.00",
        status: "scheduled",
    },
]

export default function PaymentHistory() {
    const [paymentFilter, setPaymentFilter] = useState<string>("all")
    const [appointmentFilter, setAppointmentFilter] = useState<string>("all")

    const filteredPayments = useMemo(() => {
        if (paymentFilter === "all") return payments
        return payments.filter((payment) => payment.status === paymentFilter)
    }, [paymentFilter])

    const getAppointmentGroup = (date: string) => {
        const today = new Date()
        const appointmentDate = new Date(date)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (appointmentDate.toDateString() === today.toDateString()) return "Today"
        if (appointmentDate.toDateString() === tomorrow.toDateString()) return "Tomorrow"
        if (appointmentDate <= new Date(today.setDate(today.getDate() + 7))) return "This Week"
        return "Upcoming"
    }

    const groupedAppointments = useMemo(() => {
        const filtered =
            appointmentFilter === "all" ? appointments : appointments.filter((apt) => apt.status === appointmentFilter)

        return filtered.reduce(
            (groups, appointment) => {
                const group = getAppointmentGroup(appointment.date)
                if (!groups[group]) groups[group] = []
                groups[group].push(appointment)
                return groups
            },
            {} as Record<string, typeof appointments>,
        )
    }, [appointmentFilter]) // Removed getAppointmentGroup from dependencies

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "failed":
                return "bg-red-100 text-red-800"
            case "scheduled":
                return "bg-blue-100 text-blue-800"
            case "confirmed":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
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
                    <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
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
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-primary/10">
                                                <CreditCard className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{payment.description}</p>
                                                <p className="text-sm text-muted-foreground">{payment.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <p className="font-medium">{payment.amount}</p>
                                            <Badge variant="secondary" className={getStatusBadgeColor(payment.status)}>
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appointments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Upcoming Appointments</CardTitle>
                                    <CardDescription>Your scheduled inspections and services</CardDescription>
                                </div>
                                <Select value={appointmentFilter} onValueChange={setAppointmentFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Appointments</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {Object.entries(groupedAppointments).map(([group, appointments]) => (
                                    <div key={group} className="space-y-4">
                                        <h3 className="font-semibold text-lg text-muted-foreground">{group}</h3>
                                        {appointments.map((appointment) => (
                                            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-full bg-primary/10">
                                                        <CalendarClock className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{appointment.service}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {appointment.vehicle} • {new Date(appointment.date).toLocaleDateString()} at{" "}
                                                            {appointment.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-4">
                                                    <p className="font-medium">{appointment.price}</p>
                                                    <Badge variant="secondary" className={getStatusBadgeColor(appointment.status)}>
                                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </ContentSection>
    )
}

