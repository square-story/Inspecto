import { CalendarClock, CreditCard } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContentSection from "@/components/content-section"

export default function PaymentHistory() {
    return (
        <ContentSection
            title="History"
            desc="View your payment history and upcoming appointments."
            scrollAreaClassName=""
        >
            <Tabs defaultValue="payments" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                    <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
                    <TabsTrigger value="completed">Completed Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="payments" className="space-y-4">
                    {/* Recent Payments Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Payments</CardTitle>
                            <CardDescription>Your last 5 payment transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        id: 1,
                                        date: "Feb 15, 2024",
                                        amount: "$150.00",
                                        description: "Vehicle Inspection - Toyota Camry",
                                        status: "Completed",
                                    },
                                    {
                                        id: 2,
                                        date: "Jan 30, 2024",
                                        amount: "$85.00",
                                        description: "Oil Change Service",
                                        status: "Completed",
                                    },
                                    {
                                        id: 3,
                                        date: "Jan 15, 2024",
                                        amount: "$220.00",
                                        description: "Brake Inspection and Service",
                                        status: "Completed",
                                    },
                                ].map((payment) => (
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
                                        <div className="text-right">
                                            <p className="font-medium">{payment.amount}</p>
                                            <p className="text-sm text-emerald-600">{payment.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appointments" className="space-y-4">
                    {/* Upcoming Appointments Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <CardDescription>Your scheduled inspections and services</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        id: 1,
                                        date: "Mar 1, 2024",
                                        time: "10:00 AM",
                                        service: "Annual Vehicle Inspection",
                                        vehicle: "Toyota Camry",
                                        price: "$150.00",
                                    },
                                    {
                                        id: 2,
                                        date: "Mar 15, 2024",
                                        time: "2:30 PM",
                                        service: "Oil Change Service",
                                        vehicle: "Toyota Camry",
                                        price: "$85.00",
                                    },
                                ].map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-primary/10">
                                                <CalendarClock className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{appointment.service}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.vehicle} • {appointment.date} at {appointment.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{appointment.price}</p>
                                            <p className="text-sm text-blue-600">Scheduled</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                    {/* Upcoming Appointments Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Completed Appointments</CardTitle>
                            <CardDescription>Your scheduled inspections and services</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        id: 1,
                                        date: "Mar 1, 2024",
                                        time: "10:00 AM",
                                        service: "Annual Vehicle Inspection",
                                        vehicle: "Toyota Camry",
                                        price: "$150.00",
                                    },
                                    {
                                        id: 2,
                                        date: "Mar 15, 2024",
                                        time: "2:30 PM",
                                        service: "Oil Change Service",
                                        vehicle: "Toyota Camry",
                                        price: "$85.00",
                                    },
                                ].map((appointment) => (
                                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-primary/10">
                                                <CalendarClock className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{appointment.service}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.vehicle} • {appointment.date} at {appointment.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{appointment.price}</p>
                                            <p className="text-sm text-blue-600">Scheduled</p>
                                        </div>
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


