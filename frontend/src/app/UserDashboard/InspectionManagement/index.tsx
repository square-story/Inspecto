import ContentSection from '@/components/content-section'
import MultiStepForm from './components/MultiStepForm'

export default function InspectionManagement() {

    return (
        <ContentSection
            title='Inspection'
            desc='Complete the step to follow the instruction'
        >
            <MultiStepForm />
        </ContentSection>
    )
}
