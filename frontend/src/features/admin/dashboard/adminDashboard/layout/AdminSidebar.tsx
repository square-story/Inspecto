import { NavUser } from "@/features/inspector/dashboard/InspectorDashBoard/layout/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { CalendarRange, Home, InspectionPanel, Users, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
    {
        title: "DashBoard",
        route: "/admin/dashboard",
        icon: Home,
    },
    {
        title: "Users",
        route: "/admin/dashboard/users",
        icon: Users,
    },
    {
        title: "Inspectors",
        route: "/admin/dashboard/inspectors",
        icon: CalendarRange,
    },
    {
        title: "Wallet",
        route: "/admin/dashboard/wallet",
        icon: Wallet,
    },
    {
        title: "Inspection Types",
        route: "/admin/dashboard/inspection-types",
        icon: InspectionPanel
    }
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
                                    <SidebarMenuButton tooltip={item.title} onClick={() => navigate(item.route)}>
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
                    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia",
                }} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AdminSidebar


