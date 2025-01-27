import Layout from "@/app/adminDashboard/layout/Layout";
import { Header } from "@/app/adminDashboard/layout/Header";
import { ModeToggle } from "@/components/ui/DarkModeSwitch";
import { ProfileDropdown } from "@/components/ProfileDropDown";
import AdminCard from "@/app/adminDashboard/components/AdminCard";


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
                <div className="w-full justify-center items-center flex h-1/2 mt-10">
                    <AdminCard />
                </div>
            </Layout>
        </>
    )
}


export default AdminDashboard