import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, ArrowRight, Calendar, DollarSign, FileCheck, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { useEffect, useState } from "react"
import { fetchAppointments } from "@/features/inspection/inspectionSlice"
import { format } from "date-fns"
import { IInspectionStats } from "@/types/inspector.dashboard.stats"
import { InspectionService } from "@/services/inspection.service"
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingSpinner from "@/components/LoadingSpinner"
import { SignedAvatar } from "@/components/SignedAvatar"
import { Inspection } from "@/features/inspection/types"
import InspectionDetailsDialog from "@/components/inspector/InspectionDetailsDialog"

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>()
    const [stats, setStats] = useState<IInspectionStats>({
        totalInspections: 0,
        totalEarnings: 0,
        pendingInspections: 0,
        completionRate: 0,
        thisMonthEarnings: 0
    })
    const { loading, withLoading } = useLoadingState();
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

    const handleRowClick = (inspection: Inspection) => {
        setSelectedInspection(inspection);
        setOpenDetails(true);
    };

    useEffect(() => {
        const fetchStats = async () => {
            await withLoading(async () => {
                try {
                    const response = await InspectionService.getStats();
                    if (response) {
                        setStats(response);
                    } else {
                        console.error("Received undefined stats");
                    }
                } catch (error) {
                    console.error("Failed to fetch stats", error);
                }
            });
        };

        fetchStats();
    }, [withLoading]);

    useEffect(() => {
        dispatch(fetchAppointments());
    }, [dispatch]);

    const { data: Inspections } = useSelector((state: RootState) => state.inspections)

    const navigate = useNavigate();

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
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : stats.totalInspections}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹  ${stats.totalEarnings}`}</div>
                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Inspections</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : stats.pendingInspections}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `${stats.completionRate}%`}</div>
                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                {/* <Button>
                    Schedule New Inspection
                </Button> */}
                <Button onClick={() => navigate('/inspector/dashboard/inspection')}>
                    View All Inspections
                </Button>
                <Button variant="outline" onClick={() => navigate('/inspector/dashboard/earnings')}>
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
                            {Inspections.map((inspection) => (
                                <TableRow key={inspection.bookingReference}>
                                    <TableCell className="font-medium">{inspection.bookingReference}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <SignedAvatar
                                                publicId={inspection.user?.profile_image}
                                                fallback={`${inspection.user?.firstName || ''} ${inspection.user?.lastName || ''}`}
                                                className="h-8 w-8"
                                            />
                                            {inspection.user.firstName}{" "}{inspection.user.lastName}
                                        </div>
                                    </TableCell>
                                    <TableCell>{format(inspection.date, "MM/dd/yyyy")}</TableCell>
                                    <TableCell>{inspection.inspectionType.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={inspection.status === "completed" ? "default" : "outline"}>
                                            {inspection.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{inspection.inspectionType.price}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => handleRowClick(inspection)}>
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
                            {[1, 2,].map((_, i) => (
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
                {selectedInspection && openDetails && (
                    <InspectionDetailsDialog onOpenChange={setOpenDetails} inspection={selectedInspection} open={openDetails} />
                )}
            </div>
        </div>
    )
}

