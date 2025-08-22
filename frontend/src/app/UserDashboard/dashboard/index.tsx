import ContentSection from "@/components/content-section"
import UserWallet from "@/components/user/user-wallet"
import { DashboardCard } from "./components/UserDashboardCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingInspections from "./components/UpcomingInspection"
import VehicleDetails from "./components/VehicleDetails"
import RecentReports from "./components/RecentReport"
import { useCallback, useEffect, useState } from "react"
import { useLoadingState } from "@/hooks/useLoadingState"
import { userService } from "@/services/user.service"
import { Inspection } from "@/features/inspection/types"
import { Vehicle } from "@/features/vehicle/vehicleSlice"


export interface IUserDashboardStats {
    upcomingInspections: number;
    myVehicles: number;
    completedInspections: number;
    upcomingInspectionsList?: Inspection[];
    myVehiclesList?: Vehicle[];
    completedInspectionsList?: Inspection[];
}


const UserDashboardView = () => {
    const { loading, withLoading } = useLoadingState();
    const [stats, setStats] = useState<IUserDashboardStats>({
        upcomingInspections: 0,
        myVehicles: 0,
        completedInspections: 0,
        upcomingInspectionsList: [],
        myVehiclesList: [],
        completedInspectionsList: [],
    });

    const fetchStats = useCallback(async () => {
        await withLoading(async () => {
            try {
                const response = await userService.getUserDashboard()
                if (response) {
                    setStats(response);
                } else {
                    console.error("Received undefined stats");
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        });
    }, [withLoading]);


    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <ContentSection title='dashboard'
            desc='Welcome to your Inspecto dashboard. View your upcoming inspections, vehicle details, and recent reports.'
            scrollAreaClassName="">
            <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard
                        title="Upcoming Inspections"
                        value={loading ? "..." : stats.upcomingInspections.toString()}
                        description="Scheduled inspections"
                    />
                    <DashboardCard
                        title="My Vehicles"
                        value={loading ? "..." : stats.myVehicles.toString()}
                        description="Registered vehicles"
                    />
                    <DashboardCard
                        title="Completed Inspections"
                        value={loading ? "..." : stats.completedInspections.toString()}
                        description="Total inspections"
                    />
                </div>

                <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-2 overflow-x-auto">
                        
                        <TabsTrigger value="upcoming">Upcoming Inspections</TabsTrigger>
                        <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
                        <TabsTrigger value="reports">Recent Reports</TabsTrigger>
                        <TabsTrigger value="wallet">Wallet info</TabsTrigger>
                    </TabsList>

                    
                    <TabsContent value="upcoming" className="space-y-4">
                        <UpcomingInspections loading={loading} inspections={stats.upcomingInspectionsList || []} />
                    </TabsContent>
                    <TabsContent value="vehicles" className="space-y-4">
                        <VehicleDetails loading={loading} vehicles={stats.myVehiclesList || []} />
                    </TabsContent>
                    <TabsContent value="reports" className="space-y-4">
                        <RecentReports loading={loading} reports={stats.completedInspectionsList || []} />
                    </TabsContent>
                    <TabsContent value="wallet" className="space-y-4">
                        <UserWallet />
                    </TabsContent>
                </Tabs>

            </div>
        </ContentSection>
    )
}

export default UserDashboardView