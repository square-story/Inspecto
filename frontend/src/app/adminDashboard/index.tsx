import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip } from "@/components/ui/tooltip"
import { Dock, User, User2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const earningData = [
    { name: "Jan", platformFee: 4000, inspectorFee: 2400, total: 6400 },
    { name: "Feb", platformFee: 3000, inspectorFee: 1398, total: 4398 },
    { name: "Mar", platformFee: 2000, inspectorFee: 9800, total: 11800 },
    { name: "Apr", platformFee: 2780, inspectorFee: 3908, total: 6688 },
    { name: "May", platformFee: 1890, inspectorFee: 4800, total: 6690 },
    { name: "Jun", platformFee: 2390, inspectorFee: 3800, total: 6190 },
    { name: "Jul", platformFee: 3490, inspectorFee: 4300, total: 7790 },
]

const AdminDashBoardContent = () => {
    const [loading] = useState(false)
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : 13}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inspectors</CardTitle>
                        <User2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `12`}</div>
                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
                        <Dock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : 80}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <Dock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : 8650}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-wrap gap-4">
                {/* <Button>
                                Schedule New Inspection
                            </Button> */}
                <Button onClick={() => navigate('/admin/dashboard/users')}>
                    <User className="h-4 w-4" />
                    View All Users
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/dashboard/inspectors')}>
                    <User2 className="h-4 w-4" />
                    View All Inspector
                </Button>
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
                                <Line type="monotone" dataKey="total" stroke="#ff7300" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashBoardContent