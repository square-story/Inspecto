import { withdrawalColumns } from "@/app/AdminWalletManagement/column";
import { DataTable } from "@/app/AdminWalletManagement/data-table";
import { earningsColumns } from "@/app/AdminWalletManagement/earnings-columns";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { useLoadingState } from "@/hooks/useLoadingState";
import { WalletService } from "@/services/wallet.service";
import { IAdminWalletStats } from "@/types/wallet.stats";
import { Clock, Download, Filter } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";



const earningData = [
    { name: "Jan", platformFee: 4000, inspectorFee: 2400, total: 6400 },
    { name: "Feb", platformFee: 3000, inspectorFee: 1398, total: 4398 },
    { name: "Mar", platformFee: 2000, inspectorFee: 9800, total: 11800 },
    { name: "Apr", platformFee: 2780, inspectorFee: 3908, total: 6688 },
    { name: "May", platformFee: 1890, inspectorFee: 4800, total: 6690 },
    { name: "Jun", platformFee: 2390, inspectorFee: 3800, total: 6190 },
    { name: "Jul", platformFee: 3490, inspectorFee: 4300, total: 7790 },
]

const withdrawalRequests = [
    {
        id: "WD001",
        user: "John Doe",
        amount: 250.0,
        requestDate: "2023-04-15T10:30:00",
        status: "pending",
        method: "Bank Transfer",
        accountDetails: "XXXX-XXXX-1234",
    },
    {
        id: "WD002",
        user: "Jane Smith",
        amount: 175.5,
        requestDate: "2023-04-14T14:45:00",
        status: "approved",
        method: "PayPal",
        accountDetails: "jane.smith@example.com",
    },
    {
        id: "WD003",
        user: "Robert Johnson",
        amount: 500.0,
        requestDate: "2023-04-13T09:15:00",
        status: "pending",
        method: "Bank Transfer",
        accountDetails: "XXXX-XXXX-5678",
    },
    {
        id: "WD004",
        user: "Emily Davis",
        amount: 320.75,
        requestDate: "2023-04-12T16:20:00",
        status: "rejected",
        method: "Venmo",
        accountDetails: "@emily-davis",
    },
    {
        id: "WD005",
        user: "Michael Wilson",
        amount: 150.0,
        requestDate: "2023-04-11T11:00:00",
        status: "pending",
        method: "PayPal",
        accountDetails: "michael.wilson@example.com",
    },
    {
        id: "WD006",
        user: "Sarah Brown",
        amount: 425.25,
        requestDate: "2023-04-10T13:30:00",
        status: "approved",
        method: "Bank Transfer",
        accountDetails: "XXXX-XXXX-9012",
    },
    {
        id: "WD007",
        user: "David Miller",
        amount: 275.5,
        requestDate: "2023-04-09T15:45:00",
        status: "pending",
        method: "Venmo",
        accountDetails: "@david-miller",
    },
    {
        id: "WD0032",
        user: "David Miller",
        amount: 275.5,
        requestDate: "2023-04-09T15:45:00",
        status: "pending",
        method: "Venmo",
        accountDetails: "@david-miller",
    },
    {
        id: "WD00332",
        user: "David Miller",
        amount: 275.5,
        requestDate: "2023-04-09T15:45:00",
        status: "pending",
        method: "Venmo",
        accountDetails: "@david-miller",
    },
    {
        id: "WD00326",
        user: "David Miller",
        amount: 275.5,
        requestDate: "2023-04-09T15:45:00",
        status: "pending",
        method: "Venmo",
        accountDetails: "@david-miller",
    },
    {
        id: "WD003262",
        user: "David Miller",
        amount: 275.5,
        requestDate: "2023-04-09T15:45:00",
        status: "pending",
        method: "Venmo",
        accountDetails: "@david-miller",
    },
]

const earningsHistory = [
    {
        id: "TR001",
        date: "2023-04-15T10:30:00",
        amount: 1250.0,
        type: "Platform Fee",
        source: "User Subscriptions",
        description: "Monthly subscription fees",
    },
    {
        id: "TR002",
        date: "2023-04-14T14:45:00",
        amount: 375.5,
        type: "Inspector Fee",
        source: "Inspection Services",
        description: "Property inspection fees",
    },
    {
        id: "TR003",
        date: "2023-04-13T09:15:00",
        amount: 500.0,
        type: "Platform Fee",
        source: "Premium Listings",
        description: "Featured property listings",
    },
    {
        id: "TR004",
        date: "2023-04-12T16:20:00",
        amount: 820.75,
        type: "Inspector Fee",
        source: "Inspection Services",
        description: "Commercial property inspections",
    },
    {
        id: "TR005",
        date: "2023-04-11T11:00:00",
        amount: 150.0,
        type: "Platform Fee",
        source: "User Subscriptions",
        description: "Annual plan upgrades",
    },
    {
        id: "TR006",
        date: "2023-04-10T13:30:00",
        amount: 425.25,
        type: "Inspector Fee",
        source: "Inspection Services",
        description: "Residential property inspections",
    },
    {
        id: "TR007",
        date: "2023-04-09T15:45:00",
        amount: 275.5,
        type: "Platform Fee",
        source: "Premium Listings",
        description: "Urgent listing fees",
    },
]

export default function WalletManagement() {
    const [stats, setStats] = useState<IAdminWalletStats>({
        totalEarnings: 0
    })
    const { loading, withLoading } = useLoadingState();
    const [activeTab, setActiveTab] = useState("overview")

    const fetchStats = useCallback(async () => {
        await withLoading(async () => {
            try {
                const response = await WalletService.getAdminWalletStats();
                if (response) {
                    setStats(response);
                } else {
                    console.error("Received undefined stats");
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        })
    }, [withLoading])

    useEffect(() => {
        fetchStats();
    }, [fetchStats])


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Wallet Management</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button variant="default" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </div>
                <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Total Earnings</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalEarnings}`}</p>
                            </Card>
                            <Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Total Earnings</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalEarnings}`}</p>
                            </Card><Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Total Earnings</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalEarnings}`}</p>
                            </Card><Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Total Earnings</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalEarnings}`}</p>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Earnings Overview</CardTitle>
                                    <CardDescription>Platform vs Inspector earnings over time</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={earningData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="platformFee" fill="#8884d8" name="Platform Fee" />
                                            <Bar dataKey="inspectorFee" fill="#82ca9d" name="Inspector Fee" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Revenue Trend</CardTitle>
                                    <CardDescription>Total earnings trend over time</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={earningData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#ff7300" name="Total Revenue" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Withdrawal Requests</CardTitle>
                                <CardDescription>Showing the 5 most recent withdrawal requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={withdrawalColumns} data={withdrawalRequests.slice(0, 5)} searchKey="user" />
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full" onClick={() => setActiveTab('withdrawals')}>
                                    View All Requests
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="withdrawals" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center">
                                <div>
                                    <CardTitle>Withdrawal Requests</CardTitle>
                                    <CardDescription>Manage all withdrawal requests from inspectors</CardDescription>
                                </div>
                                <Button className="ml-auto" variant="default">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Pending Requests
                                    <Badge variant="secondary" className="ml-2">
                                        {withdrawalRequests.filter((req) => req.status === "pending").length}
                                    </Badge>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={withdrawalColumns} data={withdrawalRequests} searchKey="user" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="earnings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Earnings History</CardTitle>
                                <CardDescription>Complete history of platform earnings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={earningsColumns} data={earningsHistory} searchKey="type" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}