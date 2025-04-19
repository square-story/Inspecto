import ContentSection from "@/components/content-section"
import UserWallet from "@/components/user/user-wallet"


const UserDashboardView = () => {
    return (
        <ContentSection title='dashboard'
            desc='This is how others will see you on the dashboard.'>
            <UserWallet/>
        </ContentSection>
    )
}

export default UserDashboardView