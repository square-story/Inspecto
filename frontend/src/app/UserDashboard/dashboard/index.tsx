import ContentSection from "@/components/content-section"
import UserWallet from "@/components/user/user-wallet"
import { DashboardCard } from "./components/UserDashboardCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingInspections from "./components/UpcomingInspection"
import VehicleDetails from "./components/VehicleDetails"
import RecentReports from "./components/RecentReport"


const UserDashboardView = () => {
    return (
        <ContentSection title='dashboard'
        desc='Welcome to your Inspecto dashboard. View your upcoming inspections, vehicle details, and recent reports.'
        scrollAreaClassName="">
            <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                    <DashboardCard 
                        title="Upcoming Inspections" 
                        value="2" 
                        description="Scheduled inspections" 
                    />
                    <DashboardCard 
                        title="My Vehicles" 
                        value="3" 
                        description="Registered vehicles" 
                    />
                    <DashboardCard 
                        title="Completed Inspections" 
                        value="5" 
                        description="Total inspections" 
                    />
                </div>

                <Tabs defaultValue="wallet" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="wallet">Wallet Info</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming Inspections</TabsTrigger>
                        <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
                        <TabsTrigger value="reports">Recent Reports</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="wallet" className="space-y-4">
                        <UserWallet />
                    </TabsContent>
                    <TabsContent value="upcoming" className="space-y-4">
                        <UpcomingInspections />
                    </TabsContent>

                    
                    <TabsContent value="vehicles" className="space-y-4">
                        <VehicleDetails />
                    </TabsContent>
                    
                    <TabsContent value="reports" className="space-y-4">
                        <RecentReports />
                    </TabsContent>
                </Tabs>
            
            </div>
        </ContentSection>
    )
}

export default UserDashboardView