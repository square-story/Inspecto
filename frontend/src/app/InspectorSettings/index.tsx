import ContentSection from "@/components/content-section"
import InspectorProfileForm from "./InspectorProfileForm"

const InspectorSettings = () => {
    return (
        <ContentSection
            title='Profile Managment'
            desc='Your Profile Details Section'
        >
            <InspectorProfileForm />
        </ContentSection>
    )
}

export default InspectorSettings