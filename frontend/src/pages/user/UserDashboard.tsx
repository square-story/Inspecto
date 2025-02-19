import { Separator } from "@/components/ui/separator"
import { CalendarRange, Car, LucideLayoutDashboard, Notebook, User } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"
import SidebarNav from "@/components/side-nav"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const UserDashboard = () => {
    const location = useLocation()

    // Function to generate breadcrumb items based on current path
    const getBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean)
        const breadcrumbs: { title: string; href: string; current: boolean }[] = []

        let currentPath = ''

        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`
            const matchingItem = sidebarNavItems.find(item =>
                item.href.toLowerCase() === currentPath.toLowerCase()
            )

            if (matchingItem) {
                breadcrumbs.push({
                    title: matchingItem.title,
                    href: currentPath,
                    current: index === pathSegments.length - 1
                })
            }
        })

        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs()

    return (
        <div className="px-4 py-6">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {breadcrumbs.map((breadcrumb) => (
                        <BreadcrumbItem key={breadcrumb.href}>
                            {breadcrumb.current ? (
                                <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink href={breadcrumb.href}>
                                        {breadcrumb.title}
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator />
                                </>
                            )}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-0.5">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Separator className="my-4 lg:my-6" />
            <div className="flex flex-1 flex-col space-y-2 md:space-y-2 overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="top-0 lg:sticky lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex w-full p-1 pr-4 overflow-y-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

const sidebarNavItems = [
    {
        title: 'Dashboard',
        icon: <LucideLayoutDashboard size={18} />,
        href: '/user/dashboard',
    },
    {
        title: 'My Vehicles',
        icon: <Car size={18} />,
        href: '/user/dashboard/vehicles',
    },
    {
        title: 'Book an Inspection',
        icon: <CalendarRange size={18} />,
        href: '/user/dashboard/inspection',
    },
    {
        title: 'History',
        icon: <Notebook size={18} />,
        href: '/user/dashboard/history',
    },
    {
        title: 'Account Settings',
        icon: <User size={18} />,
        href: '/user/dashboard/settings',
    },
]

export default UserDashboard