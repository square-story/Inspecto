import NavBar from "@/app/InspectorDashBoard/layout/InspectorNavBar"
import Layout from "@/app/InspectorDashBoard/layout"
import { Outlet } from "react-router-dom"

const InspectorDashboard = () => {
    return (
        <>
            <Layout>
                <NavBar />
                <Outlet />
            </Layout >
        </>
    )
}

export default InspectorDashboard