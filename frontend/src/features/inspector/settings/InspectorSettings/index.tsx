import ContentSection from "@/components/content-section"
import InspectorProfileForm from "./InspectorProfileForm"
import PasswordManagement from "../../components/PasswordManagment"

const InspectorSettings = () => {

    return (
        <>

            <ContentSection
                title='Profile Managment'
                desc='Your Profile Details Section'
            >
                <div className="grid gap-5">
                    <PasswordManagement />
                    <InspectorProfileForm />
                </div>


            </ContentSection>

        </>
    )
}

export default InspectorSettings