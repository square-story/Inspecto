import NavBar from "@/app/InspectorDashBoard/layout/InspectorNavBar"
import Layout from "@/app/InspectorDashBoard/layout"
import { Outlet } from "react-router-dom"
import { Header } from "@/app/adminDashboard/layout/Header"
import { ModeToggle } from "@/components/ui/DarkModeSwitch"
import { UserNav } from "@/app/InspectorDashBoard/components/UserNav"

const InspectorDashboard = () => {
    return (
        <>
            <Layout>
                <Header>
                    <NavBar />
                    <h1 className="font-bold text-2xl cursor-pointer">Inspecto</h1>
                    <div className='ml-auto flex items-center gap-4'>
                        <ModeToggle />
                        <UserNav />
                    </div>
                </Header>
                <Outlet />
            </Layout >
        </>
    )
}

export default InspectorDashboard