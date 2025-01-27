import Layout from "@/app/adminDashboard/layout/Layout";
import { Header } from "@/app/adminDashboard/layout/Header";
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