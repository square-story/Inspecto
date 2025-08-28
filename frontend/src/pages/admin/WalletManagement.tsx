
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




export default function WalletManagement() {
    const [stats, setStats] = useState<IAdminWalletStats>({
        totalPlatformEarnings: 0,
        totalProfit: 0,
        totalTransactions: 0,
        recentTransactions: [],
        totalWithdrawals: 0,
        totalWithdrawalAmount: 0,
        pendingWithdrawalAmount: 0,
        withdrawalStats: [],
        earningsStats: [],
        earningData: []
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
                    <h2 className="text-sm lg:text-3xl font-bold tracking-tight">Wallet Management</h2>
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
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 overflow-x-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Platform Earnings</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalPlatformEarnings}`}</p>
                            </Card>
                            <Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Net Profit</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalProfit}`}</p>
                            </Card>
                            <Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Pending Withdrawals</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.pendingWithdrawalAmount}`}</p>
                            </Card>
                            <Card className="p-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Total Withdrawals</h3>
                                <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalWithdrawalAmount}`}</p>
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
                                        <BarChart data={stats.earningData}>
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
                                        <LineChart data={stats.earningData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#ff7300" />
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
                                <DataTable columns={withdrawalColumns} data={stats.withdrawalStats} searchKey="user" />
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
                                        {stats.withdrawalStats.filter((req) => req.status === "pending".toUpperCase()).length}
                                    </Badge>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={withdrawalColumns} data={stats.withdrawalStats} searchKey="user" />
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
                                <DataTable columns={earningsColumns} data={stats.earningsStats} searchKey="type" />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}