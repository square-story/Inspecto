import Layout from "@/app/adminDashboard/layout/Layout";
import { AdminCard } from "@/app/adminDashboard/components/AdminCard";
import { Header } from "@/app/adminDashboard/layout/Header";
import { ModeToggle } from "@/components/ui/DarkModeSwitch";


const AdminDashboard = () => {
    return (
        <>
            <Layout>
                <Header>
                    <div className='ml-auto flex items-center gap-4'>
                        <ModeToggle />
                    </div>
                </Header>
                <AdminCard />
            </Layout>
        </>
    )
}


export default AdminDashboard