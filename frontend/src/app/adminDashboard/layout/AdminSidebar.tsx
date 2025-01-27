import { NavUser } from "@/app/InspectorDashBoard/layout/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Banknote, Car, Home, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
    {
        title: "DashBoard",
        route: "/inspector/dashboard",
        icon: Home,
    },
    {
        title: "Assigned Inspections",
        route: "/inspector/dashboard/inspection",
        icon: Car,
    },
    {
        title: "Earning history",
        route: "/inspector/dashboard/earnings",
        icon: Banknote,
    },
    {
        title: "Settings",
        route: "/inspector/dashboard/settings",
        icon: Settings2,
    },
];

const AdminSidebar = () => {
    const navigate = useNavigate()
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}
                                    className={location.pathname.startsWith(item.route) ? "active" : ""}
                                >
                                    <SidebarMenuButton onClick={() => navigate(item.route)}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: "Admin",
                    email: "No email provided",
                    avatar: "default-avatar.png",
                }} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AdminSidebar