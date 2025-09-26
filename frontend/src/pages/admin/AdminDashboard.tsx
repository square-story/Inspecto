import Layout from "@/features/admin/dashboard/adminDashboard/layout/Layout";
import { Header } from "@/features/admin/dashboard/adminDashboard/layout/Header";
import { ModeToggle } from "@/components/ui/DarkModeSwitch";
import { ProfileDropdown } from "@/components/ProfileDropDown";
import { Outlet } from "react-router-dom";


const AdminDashboard = () => {
    return (
        <>
            <Layout>
                <Header>
                    <div className='ml-auto flex items-center gap-4'>
                        <ModeToggle />
                        <ProfileDropdown />
                    </div>
                </Header>
                <Outlet />
            </Layout>
        </>
    )
}


export default AdminDashboard