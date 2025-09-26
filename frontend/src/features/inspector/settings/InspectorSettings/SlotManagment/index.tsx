import ContentSection from "@/components/content-section"
import InspectorSlotForm from "./component/InspectorSlotForm"

const SlotManagment = () => {
    return (
        <ContentSection
            title='Slot Managment'
            desc='Your Slot Details Section'
        >
            <InspectorSlotForm />
        </ContentSection>
    )
}

export default SlotManagment