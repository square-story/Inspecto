import ContentSection from '@/components/content-section'
import MultiStepForm from './components/MultiStepForm'

export default function InspectionManagement() {

    return (
        <ContentSection
            title='Profile'
            desc='This is how others will see you on the site.'
        >
            <MultiStepForm />
        </ContentSection>
    )
}
