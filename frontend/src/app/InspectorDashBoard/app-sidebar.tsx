import { Banknote, Car, Home, Settings2 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

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
} from "@/components/ui/sidebar"
import { NavUser } from "@/app/InspectorDashBoard/layout/nav-user"
import { useSelector } from "react-redux"
import { RootState } from "@/features/store"

// Menu items with routes
const items = [
    {
        title: "DashBoard",
        route: "/dashboard",
        icon: Home,
    },
    {
        title: "Assigned Inspections",
        route: "/inspections",
        icon: Car,
    },
    {
        title: "Earning history",
        route: "/earnings",
        icon: Banknote,
    },
    {
        title: "Settings",
        route: "/settings",
        icon: Settings2,
    },
]

export function AppSidebar() {
    const location = useLocation()
    const inspector = useSelector((state: RootState) => state.inspector)

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>M A I N  M E N U</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className={location.pathname === item.route ? 'active' : ''}
                                >
                                    <SidebarMenuButton asChild>
                                        <Link to={item.route}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
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
                        name: inspector.firstName,
                        email: inspector.email,
                        avatar: inspector.profile_image
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    )
}