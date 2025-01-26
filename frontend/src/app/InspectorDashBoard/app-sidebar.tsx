import { Banknote, Car, Home, Settings2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/app/InspectorDashBoard/layout/nav-user";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Menu items with routes
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

export function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const inspector = useSelector((state: RootState) => state.inspector);

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>M A I N M E N U</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
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
                <NavUser
                    user={{
                        name: inspector.firstName || "Inspector",
                        email: inspector.email || "No email provided",
                        avatar: inspector.profile_image || "default-avatar.png",
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    );
}
