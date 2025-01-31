import SidebarNav from "@/components/side-nav"
import { Separator } from "@/components/ui/separator"
import { DockIcon, LocateFixedIcon, TimerIcon, User } from "lucide-react"
import { Outlet } from "react-router-dom"

const InspectorProfile = () => {
    return (
        <div className="px-4 py-6">
            <Separator className='my-4 lg:my-6' />
            <div className='flex flex-1 flex-col space-y-2 md:space-y-2 overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0 '>
                <aside className='top-0 lg:sticky lg:w-1/4'>
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className='flex w-full p-1 pr-4 overflow-y-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default InspectorProfile


const sidebarNavItems = [
    {
        title: 'Profile Managment',
        icon: <User size={18} />,
        href: '/inspector/dashboard/settings',
    },
    {
        title: 'Address Managment',
        icon: <LocateFixedIcon size={18} />,
        href: '/inspector/dashboard/settings/address',
    },
    {
        title: 'Slot Managment',
        icon: <TimerIcon size={18} />,
        href: '/inspector/dashboard/settings/slot',
    },
    {
        title: 'Document Managment',
        icon: <DockIcon size={18} />,
        href: '/inspector/dashboard/settings/document',
    }
]